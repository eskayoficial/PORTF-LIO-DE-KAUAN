import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

/**
 * Servidor Java sem dependências externas (JDK 17 ou superior).
 * Sirva a pasta do portfólio e publique os projetos em /api/projects.
 * Executar a partir da raiz do projeto: java java/PortfolioServer.java
 */
public class PortfolioServer {
    private static final Map<String, String> TYPES = Map.of(
        "html", "text/html; charset=UTF-8",
        "css", "text/css; charset=UTF-8",
        "js", "text/javascript; charset=UTF-8",
        "json", "application/json; charset=UTF-8",
        "svg", "image/svg+xml",
        "png", "image/png",
        "jpg", "image/jpeg",
        "ico", "image/x-icon"
    );
    private static final Path ROOT = Path.of(".").toAbsolutePath().normalize();
    public static void main(String[] args) throws Exception {
        int port = 8080;
        if (args.length > 0) port = Integer.parseInt(args[0]);
        HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", port), 0);
        server.createContext("/", PortfolioServer::handle);
        server.setExecutor(java.util.concurrent.Executors.newFixedThreadPool(4));
        server.start();
        System.out.println("Portfólio Kauan no ar: http://localhost:" + port);
        System.out.println("API de projetos: http://localhost:" + port + "/api/projects");
        System.out.println("Pressione Ctrl+C para parar.");
    }
    private static void handle(HttpExchange e) throws IOException {
        try {
            e.getResponseHeaders().set("X-Content-Type-Options", "nosniff");
            e.getResponseHeaders().set("Referrer-Policy", "strict-origin-when-cross-origin");
            if (!"GET".equals(e.getRequestMethod()) && !"HEAD".equals(e.getRequestMethod())) {
                respond(e, 405, "text/plain; charset=UTF-8", "Método não permitido".getBytes(StandardCharsets.UTF_8));
                return;
            }
            String req = e.getRequestURI().getPath();
            if (req.equals("/api/health")) {
                respond(e, 200, TYPES.get("json"), "{\"status\":\"ok\",\"site\":\"Kauan\"}".getBytes(StandardCharsets.UTF_8)); return;
            }
            if (req.equals("/api/projects")) req = "/assets/data/projects.json";
            if (req.endsWith("/")) req += "index.html";
            Path target = ROOT.resolve(req.substring(1)).normalize();
            if (!target.startsWith(ROOT) || !Files.isRegularFile(target)) {
                respond(e, 404, "text/plain; charset=UTF-8", "Arquivo não encontrado".getBytes(StandardCharsets.UTF_8)); return;
            }
            String name = target.getFileName().toString();
            String ext = name.contains(".") ? name.substring(name.lastIndexOf('.') + 1).toLowerCase() : "";
            if (!TYPES.containsKey(ext)) {
                respond(e, 403, "text/plain; charset=UTF-8", "Tipo de arquivo não permitido".getBytes(StandardCharsets.UTF_8)); return;
            }
            if (req.startsWith("/java/")) {respond(e, 403, "text/plain; charset=UTF-8", "Acesso negado".getBytes(StandardCharsets.UTF_8));return;}
            respond(e, 200, TYPES.get(ext), Files.readAllBytes(target));
        } finally {e.close();}
    }
    private static void respond(HttpExchange e, int status, String contentType, byte[] data) throws IOException {
        e.getResponseHeaders().set("Content-Type", contentType);
        e.getResponseHeaders().set("Cache-Control", "no-cache");
        if ("HEAD".equals(e.getRequestMethod())) {e.getResponseHeaders().set("Content-Length", String.valueOf(data.length)); e.sendResponseHeaders(status,-1); return;}
        e.sendResponseHeaders(status, data.length);
        try (OutputStream out=e.getResponseBody()) {out.write(data);}
    }
}
