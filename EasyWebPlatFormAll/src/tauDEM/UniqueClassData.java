package tauDEM;

public class UniqueClassData {
	public int []classData;
	public UniqueClassData(String Min, String Max, String UniqueValues){
		//int min = Integer.parseInt(Min);
		int max = Integer.parseInt(Max);
		classData = new int[max];        
		for(int i = 0; i< max; i++){
			classData[i] = i+1;
		}
	}
}
