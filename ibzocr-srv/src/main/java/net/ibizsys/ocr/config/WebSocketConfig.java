package net.ibizsys.ocr.config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.WebSocketConfigurationSupport;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

/**
 * 注册webscoket
 * @author tangyong
 *
 */
@Configuration
public class WebSocketConfig extends WebSocketConfigurationSupport {

	@Autowired
	MyWebSocketHandler handler;

	@Override
	protected void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(handler, "/websocket/mywebsocket").setAllowedOrigins("*");
		super.registerWebSocketHandlers(registry);
	}


}
