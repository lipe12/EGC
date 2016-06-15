package cn.com.action;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;

import tutorial.Constant;

import com.opensymphony.xwork2.ActionSupport;

public class VerifyAction extends ActionSupport{

	private String propertyPath;
	
	private String uncertaintyPath;
	
	private String verifySamplePath;
	
	private String fieldName;
	
	private boolean tag;
	
	private float rmse;
	
	public float getRmse() {
		return rmse;
	}

	public void setRmse(float rmse) {
		this.rmse = rmse;
	}

	public boolean isTag() {
		return tag;
	}

	public void setTag(boolean tag) {
		this.tag = tag;
	}

	public String getFieldName() {
		return fieldName;
	}

	public void setFieldName(String fieldName) {
		this.fieldName = fieldName;
	}

	
	public String verify(){
		
		tag = false;
		
        String soilPath =  Constant.DataFilePath + File.separator +  propertyPath;
		
		String samplePath = Constant.DataFilePath + File.separator + verifySamplePath;
		
		this.readASC(soilPath);
		
		this.count(samplePath);
		double [] obsers = this.readSample(samplePath, fieldName);
		double [] simus = this.extractValue();
		
		rmse = (float)this.RMSE(obsers,simus);
		                                                         
		tag = true;
		
		System.out.println(rmse);
		
		return SUCCESS;
	}
	/***
	 * write the validate result into a txt file
	 */
	private void writeValidate(){
		
	}
	
	
	private int ncols ; // ncols 
    private int nrows ; // nrows 
    private double xllcorner ; // xllcorner 
    private double yllcorner ; // yllcorner 
    private double cellsize ; //  cellsize 
    private double NODATA_value ; //  NODATA_value  
    private double values [][];
	private void readASC(String ascPath){
		
		try{
			
			File file = new File(ascPath); 
	        InputStreamReader reader = new InputStreamReader(new FileInputStream(file));  
	        BufferedReader buffer = new BufferedReader(reader); 
	        
	        
	        ncols = Integer.valueOf(buffer.readLine().split(" {1,}")[1]); // read ncols 
	        nrows = Integer.valueOf(buffer.readLine().split(" {1,}")[1]); // read nrows 
	        xllcorner = Double.valueOf(buffer.readLine().split(" {1,}")[1]); // read xllcorner 
	        yllcorner = Double.valueOf(buffer.readLine().split(" {1,}")[1]); // read yllcorner 
	        cellsize = Double.valueOf(buffer.readLine().split(" {1,}")[1]); // read cellsize 
	        NODATA_value = Double.valueOf(buffer.readLine().split(" {1,}")[1]); // read NODATA_value 
	        
	        values  = new double [nrows][ncols];
	        
	        //System.out.println("cols:" + ncols);
	        //System.out.println("rows:" + nrows);
	        
	        String line = null;
	        
	        int rowIndex = 0;
	        
	        while ((line = buffer.readLine()) != null ) {  
	        	
	        	String temps [] = line.split(" {1,}"); 
	        	
	        	//System.out.println("temps length: " +  temps.length);
	        	
	        	for(int j =0; j< ncols; j++){
	        		
	        		values[rowIndex][j] = Double.valueOf(temps[j]);
	        	}
	        	
	        	rowIndex ++;
	        }
	        
	        buffer.close();
	        reader.close();
	        
		}catch(Exception e){
			
			e.printStackTrace();
		}
		
	}
	
	private double X[];
	private double Y[];
	private double Observs[];
	private int sampleCount;

	private int count(String samplePath){
		
		try{
			File file = new File(samplePath); 
	        InputStreamReader reader = new InputStreamReader(new FileInputStream(file));  
	        BufferedReader buffer = new BufferedReader(reader); 
	        
	      
	        sampleCount = 0;
	        buffer.readLine();// read file head
	        while ((buffer.readLine()) != null ) {  
	        	
	        	sampleCount ++;
	        }
		}catch(Exception e){
			
			e.printStackTrace();
		}
		
		return 0;
	}
	
	private double[] readSample(String samplePath, String field){
		
		try{
			
			File file = new File(samplePath); 
	        InputStreamReader reader = new InputStreamReader(new FileInputStream(file));  
	        BufferedReader buffer = new BufferedReader(reader); 
	        
	        
	        String filedHead [] = buffer.readLine().split(","); // read file head
	        
	        int filedIndex = -1;
	        int XIndex = -1;
	        int YIndex = -1;
	        
	        int num = filedHead.length;
	        
	        int index =0;
	        
	        for(int i =0; i < num; i++){
	        	
	        	if(filedHead[i].equals(field)){
	        		
	        		filedIndex = index;
	        		
	        	}else if(filedHead[i].equals("X")){
	        		
	        		XIndex = index;
	        		
	        	}else if(filedHead[i].equals("Y")){
	        		
	        		YIndex = index;
	        	}
	        	
	        	index ++;
	        }
	        String line = null;
	        
	        int sampleIndex = 0;
	       
	        X = new double[sampleCount];
	        Y = new double[sampleCount];
	        Observs = new double[sampleCount];
	        
	        while ((line = buffer.readLine()) != null ) {  
	        	
	        	String temps [] = line.split(",");
	        	
	        	X[sampleIndex] = Double.valueOf(temps[XIndex]);
	        	Y[sampleIndex] = Double.valueOf(temps[YIndex]);
	        	Observs[sampleIndex] = Double.valueOf(temps[filedIndex]);
	        	
	        	sampleIndex++;
	 
	        }
	        
		}catch(Exception e){
			
			e.printStackTrace();
			
		}
		
		return Observs;
	}
	
	private double [] Simus;
	private double [] extractValue(){
		
		Simus = new double[sampleCount];
		
		yllcorner = yllcorner + nrows*cellsize;// turn left bottom to left top
		
		for(int i = 0; i<sampleCount; i++){
			
			double currentX = X[i];
			double currentY = Y[i];
			
			int rowIndex = (int) Math.ceil((yllcorner - currentY)/cellsize) - 1;
			
			int colIndex = (int) Math.ceil((currentX - xllcorner)/cellsize) - 1;
			
			if(colIndex == -1){
				
				colIndex = 0;
			}
			
			if(rowIndex == -1){
				
				rowIndex = 0;
			}
			
			Simus[i] =  values[rowIndex][colIndex];
			
			System.out.println(Simus[i] + ";" + currentX + ";" + currentY);
			
		}
		
		return Simus;
		
	}
	
	private double RMSE(double [] obsers, double [] simus){
		
		double temp = 0.0;
		
		for(int i =0; i< sampleCount; i++){
			
			temp = temp + (obsers[i] - simus[i])*(obsers[i] - simus[i]);
		}
		
		double rmse = Math.sqrt(temp/sampleCount) ;
		
		return rmse;
	}
	
	public static void main(String[] args) {
		
		VerifyAction very  = new VerifyAction();
		
		//String soilPath = "M:\\org_lj_gaussian_yl.asc";
		//String samplePath = "M:\\validation.csv";
		
		//String soilPath = "D:\\validate\\PropertyMap1428376395600.asc";
	    //String samplePath = "D:\\validate\\pnts_ylA_all.csv";
		
		String soilPath = "D:\\validate\\PropertyMap1428546044297.asc";
	    String samplePath = "D:\\validate\\xinjiang_samples.csv";
		
		
		very.readASC(soilPath);
		
		very.count(samplePath);
		//double [] obsers = very.readSample(samplePath,"ORG");
		//double [] obsers = very.readSample(samplePath,"Silt");
		double [] obsers = very.readSample(samplePath,"ORGNIC");
		double [] simus = very.extractValue();
		
		double rmse = very.RMSE(obsers,simus);
		
		System.out.println(rmse);
	}
	
	public String getPropertyPath() {
		return propertyPath;
	}

	public void setPropertyPath(String propertyPath) {
		this.propertyPath = propertyPath;
	}

	public String getUncertaintyPath() {
		return uncertaintyPath;
	}

	public void setUncertaintyPath(String uncertaintyPath) {
		this.uncertaintyPath = uncertaintyPath;
	}

	public String getVerifySamplePath() {
		return verifySamplePath;
	}

	public void setVerifySamplePath(String verifySamplePath) {
		this.verifySamplePath = verifySamplePath;
	}
}
