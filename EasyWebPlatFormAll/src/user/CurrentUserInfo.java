package user;

public class CurrentUserInfo {
	public static int userCount = 0;
	public static int uperlimit = 999;
	public static boolean checkCount(){       
		System.out.println("current userCount is " + userCount);
		return (userCount < uperlimit);       
	}
	public static void increaseCount(){
		
		userCount = userCount +1;
	}
	public static void decreaseCount(){
		
		userCount = userCount -1;
	}
}
