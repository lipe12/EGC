package bpelUtility;

import java.util.HashMap;
import java.util.ArrayList;

/**
 * build key-value form*/
public class oneToNMap {



    public  HashMap<String,ArrayList<String>> map = new HashMap<String,ArrayList<String>>();  
    
    public  void putAdd(String sr,String s){    

         if(!map.containsKey(sr)){  

             map.put(sr, new ArrayList<String>());  

          }  
         map.get(sr).add(s);
    }

    public  void putAdd(String sr,String[] s){  

        if(!map.containsKey(sr)){  

            map.put(sr, new ArrayList<String>());  

         }  
         for(int i=0;i<s.length;i++){  
	            map.get(sr).add(s[i]);  
	        }  

     }  

}
