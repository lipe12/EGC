package util;

import javax.servlet.http.HttpServletRequest;

/**
 * @author Houzw
 * @Description File handler utils
 * @Createdate 2016年7月29日 下午1:00:48
 */
public class FileUtil
{
	/**
	 * get the absolute root file-path of this web app<br>
	 * 获得 webapp 的根路径
	 * 
	 * @param request
	 * @return
	 * @Houzw at 2016年7月29日下午1:03:42
	 */
	public static String getAppPath(HttpServletRequest request)
	{
		return request.getSession().getServletContext().getRealPath("/");
	}

	/**
	 * get xml folder path:WEB-INF\\xml
	 * 
	 * @param request
	 * @return
	 * @Houzw at 2016年8月26日下午5:00:38
	 */
	public static String getXMLDirPath(HttpServletRequest request)
	{
		return getAppPath(request) + "WEB-INF\\xml";
	}

}
