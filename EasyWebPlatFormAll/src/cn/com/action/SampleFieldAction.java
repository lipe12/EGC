package cn.com.action;

import tutorial.Constant;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import  cn.com.bean.SampleField;

import com.opensymphony.xwork2.ActionSupport;

public class SampleFieldAction extends ActionSupport{
	private String filename;
    private List<SampleField>  samplefields = new ArrayList<SampleField>();
    
    public String execute(){ 
    	if(filename == null||filename.equals("")){
    		
    		return SUCCESS;       
    	}else{
    		BufferedReader buffer;
        	String _filename = Constant.DataFilePath + File.separator + filename;
    		try {
    			buffer = new BufferedReader(new FileReader(_filename)); 
    			try {
    				String line = buffer.readLine();
    				String [] colums = line.split(",");
    				for(String colum : colums){
    					SampleField field = new SampleField();
    					field.setId(colum);
    					field.setName(colum);
    					samplefields.add(field);
    				}
    				buffer.close();
    			} catch (IOException e) {
    				
    				e.printStackTrace();
    			}
    		} catch (FileNotFoundException e1) {
    			// TODO Auto-generated catch block
    			
    			e1.printStackTrace();
    		}   	
    	}
    	return SUCCESS;
    }
	public String getFilename() {
		return filename;
	}

	public List<SampleField> getSamplefields() {
		return samplefields;
	}

	public void setSamplefields(List<SampleField> samplefields) {
		this.samplefields = samplefields;
	}

	public void setFilename(String filename) {
		this.filename = filename;
	}
}
