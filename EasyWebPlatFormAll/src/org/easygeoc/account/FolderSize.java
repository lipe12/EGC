package org.easygeoc.account;
import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;

import com.opensymphony.xwork2.ActionSupport;

import tutorial.Constant;

import java.io.File;

/**
 * this class is to find whether the user folder is lager than 2G(manager define the disk size)
 * @author lp
 * @since 2016-06-14
 * */
public class FolderSize extends ActionSupport{
	String tag_capacity;                    //the tag whether folder lager than 2G
	public String getTag_capacity() {
		return tag_capacity;
	}
	public void setTag_capacity(String tag_capacity) {
		this.tag_capacity = tag_capacity;
	}
	/**
	 * this method is to find the folder size by iteration
	 * @param directory  specified user folder
	 * @return length the folder size, including files and folders in a user folder
	 * */
	public static long folderSize(File directory)
    {
        long length = 0;
        for (File file : directory.listFiles()) {
            if (file.isFile())
                length += file.length();
            else
                length += folderSize(file);
        }
        return length;
    }
	/**
	 * this method is to receive the Http request and get the user name, call function folderSize
	 * */
	@Override
	public String execute()
	{
		HttpServletRequest request = ServletActionContext.getRequest();
		
		String username = (String)request.getSession().getAttribute("username");
	    
		String folderpath = Constant.DataFilePath + File.separator + username;
		
		File folder = new File(folderpath);
		
		long foldsize = 0;
		foldsize = folderSize(folder);
		if(foldsize < 1024 *1024 *1024)
			tag_capacity = "0";
		else 
			tag_capacity = "1";
		
		if (foldsize != 0)
			return SUCCESS;
		else
			return ERROR;
	}
}
