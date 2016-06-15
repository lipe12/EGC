package tutorial;

import java.util.ArrayList;

public class ClassData {
	   public	float [][]classData;
	   public ClassData(String min_s, String max_s){
		   classData = new float [255][2];
		   
		   float min = Float.valueOf(min_s);        
		   float max = Float.valueOf(max_s);
		   float distance = max - min;       
		   float interval = distance/255;       
		   for(int i =0; i< 255; i++){               
			   classData[i][0]= min + i*interval;
			   classData[i][1]= classData[i][0] + interval;
		   }   
	   }
	   
	   public ClassData(String min_s, String max_s, String filename, int tag){
		   if(filename.contains("StreamLine")){
			   classData = new float [1][2];
			   
			   float min = Float.valueOf(min_s);        
			   float max = Float.valueOf(max_s);
			   
			   classData[0][0]= min ;
			   classData[0][1]= max ;
			   
		   }else{
			   classData = new float [255][2];
			   
			   float min = Float.valueOf(min_s);        
			   float max = Float.valueOf(max_s);
			   float distance = max - min;       
			   float interval = distance/255;       
			   for(int i =0; i< 255; i++){               
				   classData[i][0]= min + i*interval;
				   classData[i][1]= classData[i][0] + interval;
			   }   
		   }
		   
	   }
	   
	   public ClassData(String min_s, String max_s, String quantile_s){
		   String [] quantile_str = quantile_s.split(" ");
		   ArrayList<String> temp_str = new ArrayList<String>();
		   String temp = min_s;
		   temp_str.add(min_s);
		   for(int i =0; i< quantile_str.length; i++){
			   if(!temp.equals(quantile_str[i])){
				   temp_str.add(quantile_str[i]);
				   temp = quantile_str[i];
			   }
		   }
		   if(!temp_str.get(temp_str.size()-1).equals(max_s)){
			   temp_str.add(max_s);
		   }
		   int len = temp_str.size();
		   classData = new float[len -1][2];
		   float [] quantile = new float [len];
		   for(int i =0; i<len ; i++ ){
			   quantile[i] = Float.valueOf(temp_str.get(i));
		   }
		   for(int i =0; i< len -1; i++){
			   classData[i][0] = quantile[i];
			   classData[i][1] = quantile[i+1];
		   }
		   
	   }
	   public ClassData(){
		   classData = new float [15][2];
		   
		   classData[0][0]= 0;
		   classData[0][1]= 1.26f;
		   
		   classData[1][0]= 1.26f;
		   classData[1][1]= 3.53f;
		   
		   classData[2][0]= 3.53f;
		   classData[2][1]= 6.55f;
		   
		   classData[3][0]= 6.55f;
		   classData[3][1]= 9.83f;
		   
		   classData[4][0]= 9.83f;
		   classData[4][1]= 12.85f;
		   
		   classData[5][0]= 12.85f;
		   classData[5][1]= 15.62f;
		   
		   classData[6][0]= 15.62f;
		   classData[6][1]= 18.39f;
		   
		   classData[7][0]= 18.39f;
		   classData[7][1]= 20.91f;
		   
		   classData[8][0]= 20.91f;
		   classData[8][1]= 23.18f;
		   
		   classData[9][0]= 23.18f;
		   classData[9][1]= 25.45f;
		   
		   classData[10][0]= 25.45f;
		   classData[10][1]= 27.97f;
		   
		   classData[11][0]= 27.97f;
		   classData[11][1]= 30.99f;
		   
		   classData[12][0]= 30.99f;
		   classData[12][1]= 34.77f;
		   
		   classData[13][0]= 34.77f;
		   classData[13][1]= 44.35f;
		   
		   classData[14][0]= 44.35f;
		   classData[14][1]= 64.26f;
	   }
	}
