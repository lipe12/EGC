package tauDEM;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Date;

import tutorial.Constant;
/***
 * 
 * @author jjc
 *
 */
public class TauDEM {
	private String CmdPath = Constant.TauDEMPath;     
	private String DataPath = Constant.DataFilePath + File.separator;
	/***
	 * 
	 * @param dem_file
	 * @param filleddem_file
	 */
	public void PitRemove(String dem_file, String filleddem_file){
		  //mpiexec -n 8 PitRemove -z logan.tif     -fel loganfel.tif
		  try{   
			  Process process = Runtime.getRuntime().exec("cmd /c mpiexec -n 4 " + CmdPath + "PitRemove.exe " 
					                                     + " -z " + DataPath + dem_file
					                                     +" -fel " + DataPath + filleddem_file); 
			  String str;
			  BufferedReader bufferedReader = new BufferedReader( new InputStreamReader(process.getInputStream())); 
			  while ( (str=bufferedReader.readLine()) !=null){System.out.println(str);}     
			  
			  process.waitFor(); 
			                   
		  }catch (IOException e){	
			  e.printStackTrace();         	
		  }catch (InterruptedException e){               
			  e.printStackTrace();    
		  } 
	}
	/***
	 * 
	 * @param filleddem_file
	 * @param flowdirec_file
	 */
	public void D8Flowdir(String filleddem_file, String flowdirec_file){
		  Date now = new Date();
		  long time = now.getTime();
		  String slope_file = time + ".tif";
		  //mpiexec -n 8 D8Flowdir  -fel loganfel.tif       -p loganp.tif  -sd8 logansd8.tif 
		  try{   
			  Process process = Runtime.getRuntime().exec("cmd /c mpiexec -n 4 " + CmdPath + "D8Flowdir.exe " 
					                                     + " -fel " + DataPath + filleddem_file
					                                     +" -p " + DataPath + flowdirec_file
			                                             +" -sd8 "+ DataPath  + slope_file);
			 
			   final InputStream is1 = process.getInputStream();     
			   final InputStream is2 = process.getErrorStream();   
			   new Thread() {   
			      public void run() {   
			         BufferedReader br1 = new BufferedReader(new InputStreamReader(is1));   
			          try {   
			              String line1 = null;   
			              while ((line1 = br1.readLine()) != null) {   
			                    if (line1 != null){System.out.println(line1);}   
			                }
			          } catch (IOException e) {   
			               e.printStackTrace();   
			          }   
			          finally{      
			               try {   
			                 is1.close();   
			               } catch (IOException e) {   
			                  e.printStackTrace();   
			              }   
			            }     
			          }     
			       }.start();   
		                       
			     new Thread() {    
			        public void  run() {    
			         BufferedReader br2 = new  BufferedReader(new  InputStreamReader(is2));    
			            try {    
			               String line2 = null ;    
			               while ((line2 = br2.readLine()) !=  null ) {    
			                    if (line2 != null){System.out.println(line2);}   
			               }
			             } catch (IOException e) {    
			                   e.printStackTrace();     
			             }    
			            finally{   
			               try {   
			                   is2.close();   
			               } catch (IOException e) {   
			                   e.printStackTrace();   
			               }   
			             }   
			          }    
			        }.start();     
                
			  process.waitFor(); 
			  process.destroy();
		} catch (IOException e) {
			
			e.printStackTrace();
			
		} catch (InterruptedException e) {
			        
			e.printStackTrace();    
		}
	}
	/***
	 * 
	 * @param flowdirec_file
	 * @param outlet_file
	 * @param candiatestream_file
	 * @param area_file
	 */
	public void AreaD8_2(String flowdirec_file, String outlet_file, String candiatestream_file, String area_file){
		  //mpiexec -n 8 Aread8 -p loganp.tif -o loganoutlet.shp -wg loganss.tif         -ad8 loganssa.tif
		  try{   
			  Process process = Runtime.getRuntime().exec("cmd /c mpiexec -n 4 " + CmdPath + "AreaD8.exe " 
					                                     + " -p " + DataPath + flowdirec_file
					                                     +" -o " + DataPath + outlet_file
					                                     +" -wg " + DataPath + candiatestream_file
					                                     +" -ad8 " + DataPath + area_file);
			  
			  String str;
			  BufferedReader bufferedReader = new BufferedReader( new InputStreamReader(process.getInputStream())); 
			  while ( (str=bufferedReader.readLine()) !=null) System.out.println(str);
			  
			  process.waitFor(); 
			 
		  }catch(IOException e){
				e.printStackTrace();
		  }catch(InterruptedException e){	        
				e.printStackTrace();    
		  }
	}
	/***
	 * 
	 * @param flowdirec_file
	 * @param area_file
	 */
	public void AreaD8(String flowdirec_file, String area_file){
		  //mpiexec -n 8 AreaD8 -p loganp.tif     -ad8 loganad8.tif  
		  try{   
			  Process process = Runtime.getRuntime().exec("cmd /c mpiexec -n 4 " + CmdPath + "AreaD8.exe " 
					                                     + " -p " + DataPath + flowdirec_file
					                                     +" -ad8 " + DataPath + area_file);
			  
			  String str;
			  BufferedReader bufferedReader = new BufferedReader( new InputStreamReader(process.getInputStream())); 
			  while ( (str=bufferedReader.readLine()) !=null) System.out.println(str);
			  
			  process.waitFor(); 
			 
		  }catch(IOException e){
				e.printStackTrace();	
		  }catch(InterruptedException e){        
				e.printStackTrace();    
		  }
	}
	/***
	 * 
	 * @param area_file
	 * @param threshold
	 * @param streamline_file
	 */
	public void Threshold(String area_file, int threshold, String streamline_file){
		  //mpiexec -n 8 Threshold -ssa loganad8.tif  -thresh 300     -src logansrc.tif  
		  try{   
			  Process process = Runtime.getRuntime().exec("cmd /c mpiexec -n 4 " + CmdPath + "Threshold.exe " 
					                                     + " -ssa " + DataPath + area_file
					                                     +" -thresh " + threshold
					                                     +" -src " + DataPath + streamline_file);
			  
			  String str;
			  BufferedReader bufferedReader = new BufferedReader( new InputStreamReader(process.getInputStream())); 
			  while ( (str=bufferedReader.readLine()) !=null) System.out.println(str);
			  
			  process.waitFor(); 
			 
		  }catch(IOException e){
				e.printStackTrace();	
		  }catch(InterruptedException e){
				e.printStackTrace();    
		  }
	}
	/***
	 * 
	 * @param flowdirec_file
	 * @param streamline_file
	 * @param initialoutlet_file
	 * @param outlet_file
	 */
	public void MoveOutletsToStreams(String flowdirec_file, String streamline_file, String  initialoutlet_file,String  outlet_file){
		  //mpiexec -n 8 MoveOutletsToStreams -p loganp.tif -src logansrc.tif -o loganoutlet0.shp         -om loganoutlet.shp

		  try{   
			  Process process = Runtime.getRuntime().exec("cmd /c mpiexec -n 4 " + CmdPath + "MoveOutletsToStreams.exe " 
					                                     + " -p " + DataPath + flowdirec_file
					                                     +" -src " + DataPath +streamline_file
					                                     +" -o " + DataPath + initialoutlet_file 
					                                     +" -om " + DataPath + outlet_file );
			  
			  String str;
			  BufferedReader bufferedReader = new BufferedReader( new InputStreamReader(process.getInputStream())); 
			  while ( (str=bufferedReader.readLine()) !=null) System.out.println(str);
			  
			  process.waitFor(); 
			 
		  }catch(IOException e){
				e.printStackTrace();	
		  }catch(InterruptedException e){       
				e.printStackTrace();    
		  }
	}
	/***
	 * 
	 * @param filleddem_file
	 * @param candidatestreamline_file
	 */
	public void PeukerDouglas(String filleddem_file, String candidatestreamline_file){
		  //mpiexec -n 8 PeukerDouglas -fel loganfel.tif         -ss loganss.tif
		  try{   
			  Process process = Runtime.getRuntime().exec("cmd /c mpiexec -n 4 " + CmdPath + "PeukerDouglas.exe " 
					                                     + " -fel " + DataPath + filleddem_file
					                                     +" -ss " + DataPath +candidatestreamline_file);
			  
			  String str;
			  BufferedReader bufferedReader = new BufferedReader( new InputStreamReader(process.getInputStream())); 
			  while ( (str=bufferedReader.readLine()) !=null) System.out.println(str);
			  
			  process.waitFor(); 
			 
		  }catch(IOException e){
				e.printStackTrace();
		  }catch(InterruptedException e){
				e.printStackTrace();    
		  }
	}
	/***
	 * 
	 * @param filleddem_file
	 * @param flowdirec_file
	 * @param area_file
	 * @param streamline_file
	 * @param outlet_file
	 * @param streamnet_file
	 * @param watershed_file
	 */
	public void Streamnet(String filleddem_file, String flowdirec_file, String area_file, String streamline_file, String outlet_file,
            String streamnet_file, String watershed_file)
	{
		Date now = new Date();
		long time = now.getTime();
		String ord_file = time + "ord.tif";
		String tree_file = time + "tree.tif";
		String coord_file = time + "coord.tif";
		//mpiexec -n 8 Streamnet -fel loganfel.tif -p loganp.tif -ad8 loganad8.tif -src logansrc.tif -o loganoutlet.shp       -ord loganord3.tif -tree logantree.dat -coord logancoord.dat -net logannet.shp -w loganw.tif  
		try{   
			Process process = Runtime.getRuntime().exec("cmd /c mpiexec -n 4 " + CmdPath + "Streamnet.exe " 
		                                    + " -fel " + DataPath + filleddem_file
		                                    +" -p " + DataPath + flowdirec_file
		                                    +" -ad8 " + DataPath + area_file 
		                                    +" -src " + DataPath + streamline_file
		                                    +" -o " + DataPath + outlet_file 
		                                    
		                                    +" -ord " + DataPath + ord_file
		                                    +" -tree " + DataPath + tree_file
		                                    +" -coord " + DataPath + coord_file
		                                    +" -net " + DataPath + streamnet_file 
		                                    +" -w " + DataPath + watershed_file);
		
			String str;
			BufferedReader bufferedReader = new BufferedReader( new InputStreamReader(process.getInputStream())); 
			while ( (str=bufferedReader.readLine()) !=null) System.out.println(str);
		
			process.waitFor(); 
		
		}catch(IOException e){
			e.printStackTrace();
		} catch(InterruptedException e){  
			e.printStackTrace();    
		}
	}
}
