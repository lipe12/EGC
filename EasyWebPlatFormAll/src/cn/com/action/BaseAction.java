package cn.com.action;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;

import com.opensymphony.xwork2.ActionSupport;

/** 
 * @author Houzw
 * @Description TODO   
 * @Createdate 2016年8月14日 上午10:51:05 
 */
public class BaseAction extends ActionSupport
{
	protected void writeJson(String jsonString) throws IOException
	{
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setContentType("text/html;charset=utf-8");
		PrintWriter out = response.getWriter();
		// System.out.println(jsonString);
		out.println(jsonString);
		out.flush();
		out.close();
	}

	protected String getUsername()
	{
		HttpServletRequest request = ServletActionContext.getRequest();
		String username = (String) request.getSession().getAttribute("username");
		return username;
	}
}
