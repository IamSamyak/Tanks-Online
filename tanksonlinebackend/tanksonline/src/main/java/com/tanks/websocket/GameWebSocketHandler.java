package com.tanks.websocket;

import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.concurrent.CopyOnWriteArraySet;

public class GameWebSocketHandler extends TextWebSocketHandler {
    private static final CopyOnWriteArraySet<WebSocketSession> sessions = new CopyOnWriteArraySet<>();
    private static final ObjectMapper mapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        broadcastPlayerCount();
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        String payload = message.getPayload();
        GameMessage gameMessage = mapper.readValue(payload, GameMessage.class);

        if ("join".equals(gameMessage.getType())) {
            broadcastPlayerCount();
        } else if ("playerMove".equals(gameMessage.getType())) {
            gameMessage.setSessionId(session.getId()); // Store sender's session ID
            broadcastPlayerMovement(gameMessage, session);
        }
    }


    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
        broadcastPlayerCount();
    }

    private void broadcastPlayerCount() throws IOException {
        int playerCount = sessions.size();
        String message = mapper.writeValueAsString(new PlayerCountMessage(playerCount));

        for (WebSocketSession session : sessions) {
            if (session.isOpen()) {
                session.sendMessage(new TextMessage(message));
            }
        }
    }

    private void broadcastPlayerMovement(GameMessage gameMessage, WebSocketSession senderSession) throws IOException {
        String movementUpdate = mapper.writeValueAsString(gameMessage);
        for (WebSocketSession session : sessions) {
            if (session.isOpen() && !session.getId().equals(senderSession.getId())) { // Skip the sender
                System.out.println("Movement "+movementUpdate);
                session.sendMessage(new TextMessage(movementUpdate));
            }
        }
    }

    // Game message structure
    public static class GameMessage {
        private String type;
        private String playerMove; // Stores movement key (w, a, s, d)
        private String sessionId; // Sender's session ID
        private String gameCode; // New field for gameCode

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getPlayerMove() { return playerMove; }
        public void setPlayerMove(String playerMove) { this.playerMove = playerMove; }

        public String getSessionId() { return sessionId; }
        public void setSessionId(String sessionId) { this.sessionId = sessionId; }

        public String getGameCode() { return gameCode; }
        public void setGameCode(String gameCode) { this.gameCode = gameCode; }
    }


    // Player count message structure
    public static class PlayerCountMessage {
        private String type = "playerCount";
        private int count;

        public PlayerCountMessage(int count) {
            this.count = count;
        }

        public String getType() { return type; }
        public int getCount() { return count; }
    }
}
