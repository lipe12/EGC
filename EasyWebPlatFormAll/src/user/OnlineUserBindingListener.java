package user;

import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionBindingListener;


public class OnlineUserBindingListener implements HttpSessionBindingListener {
    String username;
     
    public OnlineUserBindingListener(String username){
        this.username=username;
    }
    public void valueBound(HttpSessionBindingEvent event) {
        HttpSession session = event.getSession();
        session.setAttribute("username", this.username);
        ServletContext application = session.getServletContext();
       
        @SuppressWarnings("unchecked")
		List<String> onlineUserList = (List<String>) application.getAttribute("onlineUserList");
      
        if (onlineUserList == null) {
            onlineUserList = new ArrayList<String>();
            application.setAttribute("onlineUserList", onlineUserList);
        }
        onlineUserList.add(this.username);
        CurrentUserInfo.increaseCount();
        CurrentUserInfo.checkCount();          
        System.out.println(this.username + "login");
    }
 
    public void valueUnbound(HttpSessionBindingEvent event) {
        HttpSession session = event.getSession();
        session.removeAttribute("username");
        ServletContext application = session.getServletContext();
        @SuppressWarnings("unchecked")
		List<String> onlineUserList = (List<String>) application.getAttribute("onlineUserList");
        onlineUserList.remove(this.username);
        CurrentUserInfo.decreaseCount();
        System.out.println(this.username + "logout");
 
    }
 
}
