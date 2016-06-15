Ext.apply(Ext.form.VTypes, {  
	   testLon: function(val){  
		 var lonTest =  /^[-]?((\d|[1-9]\d|1[0-7]\d)(\.\d{1,5})?$)|(180$)/;  
		 var  state =  lonTest.test(val);   
	        if(state){  
	            return true;  
	        }else{  
	            return false;  
	        }		
        },  
        testLonText: 'Longitude must be between -180 and 180!'  
    },{
 	   testLat: function(val){  
		 var latTest =  /^[-]?((\d|[1-8]\d)(\.\d{1,5})?$)|(90$)/;  
		 var  state =  latTest.test(val);   
	        if(state){  
	            return true;  
	        }else{  
	            return false;  
	        }		
       },  
       testLatText: 'Latitude must be between -90 and 90!' 
    }); 