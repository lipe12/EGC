package bpelUtility;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.jdom2.Attribute;
import org.jdom2.CDATA;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.JDOMException;
import org.jdom2.Namespace;
import org.jdom2.input.SAXBuilder;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter; 
import org.jdom2.xpath.XPath;
 

public class bpelUtility {
	
	private long longtime;
	public bpelUtility(){
        Date d = new Date();
		longtime = d.getTime(); 
	}
	     
	public  String GetSoapAction(String wsdlPath){
		String soapAction = null;
		String wsdlNS = "http://schemas.xmlsoap.org/wsdl/";
		String soapNS = "http://schemas.xmlsoap.org/wsdl/soap/";
		SAXBuilder builder = new SAXBuilder();
		try {
		    Document jdoc=builder.build("file:" + File.separator + wsdlPath); 
		    XPath xpath = XPath.newInstance("/ns:definitions/ns:binding/ns:operation/soap:operation");
		    xpath.addNamespace("ns",wsdlNS);  
		    xpath.addNamespace("soap",soapNS);
		    Element soap_operation = (Element)xpath.selectSingleNode(jdoc);
		    soapAction = soap_operation.getAttributeValue("soapAction");
		}catch (JDOMException e) {
		    e.printStackTrace();
		} catch (IOException e) {
		    e.printStackTrace();  
		}
		System.out.println(soapAction);
		return soapAction;
	}
	public  String GetSoapAddress(String wsdlPath){
		String soapAddress = null;
		String wsdlNS = "http://schemas.xmlsoap.org/wsdl/";
		String soapNS = "http://schemas.xmlsoap.org/wsdl/soap/";
		SAXBuilder builder = new SAXBuilder();
		try {
		    Document jdoc=builder.build("file:" + File.separator + wsdlPath); 
		    XPath xpath = XPath.newInstance("/ns:definitions/ns:service/ns:port/soap:address");
		    xpath.addNamespace("ns",wsdlNS);  
		    xpath.addNamespace("soap",soapNS);
		    Element soap_address = (Element)xpath.selectSingleNode(jdoc);
		    soapAddress = soap_address.getAttributeValue("location");
		}catch (JDOMException e) {
		    e.printStackTrace();
		} catch (IOException e) {
		    e.printStackTrace();  
		}
		System.out.println(soapAddress);
		return soapAddress;
	}
	public  String CreateSoap(String wsdlPath, oneToNMap inputs){
		
		String soap = null;
		String wsdl = "http://schemas.xmlsoap.org/wsdl/";
		String tns = null;
		Document jdoc = null;
		SAXBuilder builder = new SAXBuilder();
		try{
			 jdoc=builder.build("file:"+ File.separator + wsdlPath); 
			 
			 XPath xpath = XPath.newInstance("/ns:definitions");
			 xpath.addNamespace("ns",wsdl);  
		   Element definitions = (Element)xpath.selectSingleNode(jdoc);
			 tns = definitions.getAttributeValue("targetNamespace");
			 
			 xpath = XPath.newInstance("/ns:definitions/ns:portType/ns:operation/ns:input");
			 xpath.addNamespace("ns",wsdl); 
		   Element operation_input = (Element)xpath.selectSingleNode(jdoc);
			 String operation_input_messageName = operation_input.getAttributeValue("message");
			 operation_input_messageName = operation_input_messageName.split(":")[1];
			 
			 xpath = XPath.newInstance("/ns:definitions/ns:message[@name='" + operation_input_messageName + "']/ns:part");
			 xpath.addNamespace("ns",wsdl);
		  Element message_part = (Element)xpath.selectSingleNode(jdoc);
			 String message_part_elementName = message_part.getAttributeValue("element");
			 message_part_elementName = message_part_elementName.split(":")[1];
			 
			 xpath = XPath.newInstance("/ns:definitions/ns:types/s:schema/s:element[@name='" + message_part_elementName + "']/s:complexType/s:sequence");
			 xpath.addNamespace("ns",wsdl);
			 xpath.addNamespace("s","http://www.w3.org/2001/XMLSchema");
		  Element schema_element_complexType_sequence = (Element)xpath.selectSingleNode(jdoc);
			 
          soap = "<soapenv:Envelope "    
                + " xmlns:q0=\"" + tns + "\""
                + " xmlns:soapenv=\"http://www.w3.org/2003/05/soap-envelope\""         
                + " xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\""
                + " xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">"
                  + "<soapenv:Body>"
                  + "<q0:" + message_part_elementName + ">";
            for(Object ele : schema_element_complexType_sequence.getChildren()){
            	Element element = (Element)ele;
            	String schema_element_complexType_sequence_elementName = element.getAttributeValue("name");
            	soap = soap + "<q0:" + schema_element_complexType_sequence_elementName + ">";
            	
            	String schema_element_complexType_sequence_element_typeName = element.getAttributeValue("type");
                schema_element_complexType_sequence_element_typeName = schema_element_complexType_sequence_element_typeName.split(":")[1];
                
   			    xpath = XPath.newInstance("/ns:definitions/ns:types/s:schema/s:complexType[@name='" + schema_element_complexType_sequence_element_typeName + "']/s:sequence");
			    xpath.addNamespace("ns",wsdl);
			    xpath.addNamespace("s","http://www.w3.org/2001/XMLSchema");
			    Element complexType_sequence = (Element)xpath.selectSingleNode(jdoc);
			    
			    int index = 0;
			    ArrayList<String> input = inputs.map.get(schema_element_complexType_sequence_elementName);
			    for(Object ele1 :  complexType_sequence.getChildren()){
			    	Element sequence_element = (Element)ele1;
			    	String sequence_elementName = sequence_element.getAttributeValue("name");
                    soap = soap + "<q0:" + sequence_elementName + ">";
                    soap = soap + input.get(index);
                    soap = soap + "</q0:" + sequence_elementName + ">";
                    index++;   
			    }
			    soap = soap + "</q0:" + schema_element_complexType_sequence_elementName + ">";
            }
            soap = soap + "</q0:" + message_part_elementName + ">";
            soap = soap + "</soapenv:Body> " + "</soapenv:Envelope> ";
		}catch(Exception e){
			e.printStackTrace(); 
		}    
		System.out.println(soap);
		return soap;
	}
/**
 * create a wsdl in C:\wsdl
 * @param srcBasePath {String} C:\\Wsdl
 * @param wsdlpaths {List<String>} the every task wsdl path called by this task process
 * */
	public String CreateWSDL(String srcBasePath ,List<String> wsdlpaths){
		SAXBuilder builder = new SAXBuilder();
        String xmlns = "http://schemas.xmlsoap.org/wsdl/";
        String plnk = "http://docs.oasis-open.org/wsbpel/2.0/plnktype";
        String soap="http://schemas.xmlsoap.org/wsdl/soap/";

		String tns = "http://www.pku.edu.cn/bpel/sample" + longtime;
		String targetNamespace = "http://www.pku.edu.cn/bpel/sample" + longtime ; 

        String vprop = "http://docs.oasis-open.org/wsbpel/2.0/varprop"; 
        String shcema = "http://www.w3.org/2001/XMLSchema";
        
        Element definitions = new Element("definitions");
	    Namespace defxmlns = Namespace.getNamespace(xmlns);
	    definitions.setNamespace(defxmlns);
	    
	    Namespace plnkns = Namespace.getNamespace("plnk",plnk);
	    definitions.addNamespaceDeclaration(plnkns);  
	    Namespace soapns = Namespace.getNamespace("soap",soap);
	    definitions.addNamespaceDeclaration(soapns);
	    Namespace tnsns = Namespace.getNamespace("tns",tns);
	    definitions.addNamespaceDeclaration(tnsns);
	    Namespace vpropns = Namespace.getNamespace("vprop",vprop);
	    definitions.addNamespaceDeclaration(vpropns);

        Document document = new Document(definitions);
        
        int index = 1;
        for(String path : wsdlpaths){
        	try{
            	Document jdoc=builder.build("file:"+ File.separator +path); 
    		    XPath xpath = XPath.newInstance("/ns:definitions");
    		    xpath.addNamespace("ns",xmlns); 
    		    Element df = (Element)xpath.selectSingleNode(jdoc);
    		    String tN = df.getAttributeValue("targetNamespace");
    		    Namespace nsi = Namespace.getNamespace("ns" + index,tN);
    		    definitions.addNamespaceDeclaration(nsi);
    		    //definitions.setAttribute("xmlns:ns" + index, tN);     
                index ++ ;  
        	} catch(Exception e){
        		e.printStackTrace();  
        	}

        }
        definitions.setAttribute("targetNamespace", targetNamespace);
        definitions.setAttribute("name", "CaculatorProcess");
            
        index = 0;
        for(String path : wsdlpaths){
        	try{
            	Document jdoc=builder.build("file:"+ File.separator +path); 
    		    XPath xpath = XPath.newInstance("/ns:definitions");
    		    xpath.addNamespace("ns",xmlns); 
    		    Element df = (Element)xpath.selectSingleNode(jdoc);
    		    String definitionsName = df.getAttributeValue("targetNamespace");
    		    String ns = null;
    		    List<Namespace> namespaces = definitions.getAdditionalNamespaces();
    		    for(Namespace temp : namespaces){
    		    	if(temp.getURI().equals(definitionsName)){
    		    		ns = temp.getPrefix();
    		    	}
    		    }
    		    
    		    xpath = XPath.newInstance("/ns:definitions/ns:portType");
    		    xpath.addNamespace("ns",xmlns); 
    		    Element portType = (Element)xpath.selectSingleNode(jdoc);
    		    String portTypeName = portType.getAttributeValue("name");
    		    
    		    xpath = XPath.newInstance("/ns:definitions/ns:portType/ns:operation");
    		    xpath.addNamespace("ns",xmlns); 
    		    Element _operationtemp = (Element)xpath.selectSingleNode(jdoc);
    		    String _operationName = _operationtemp.getAttributeValue("name");
    		    
    		    Element partnerLinkType = new Element("partnerLinkType");
    		    Namespace pltNS = Namespace.getNamespace("plnk", plnk);
    		    partnerLinkType.setNamespace(pltNS);
    		    partnerLinkType.setAttribute("name", _operationName + "PLT");
    		    definitions.addContent(partnerLinkType);
    		    
    		    Element role = new Element("role");
    		    role.setNamespace(pltNS);
                role.setAttribute("name", _operationName + "Provider");   
                role.setAttribute("portType", ns + ":" + portTypeName);
                partnerLinkType.addContent(role);
        	} catch(Exception e){
        		e.printStackTrace();  
        	}
        }// end of for
        index = 0;
        for(String path : wsdlpaths){
        	try{
            	Document jdoc=builder.build("file:"+ File.separator + path); 
    		    XPath xpath = XPath.newInstance("/ns:definitions");
    		    xpath.addNamespace("ns",xmlns); 
    		    Element df = (Element)xpath.selectSingleNode(jdoc);
    		    String definitionsName = df.getAttributeValue("targetNamespace");
    		    
    		    String[] _locations = path.split("\\\\");
                String _location = _locations[_locations.length - 1];
                String _namespace = definitionsName;
                
                Element _import = new Element("import",xmlns);  
                _import.setAttribute("location", _location);
                _import.setAttribute("namespace", _namespace);
                definitions.addContent(_import);
                index++;

        	}catch(Exception e){
        		e.printStackTrace();  
        	}
      }// end of for
      Element types = new Element("types",xmlns);   
      definitions.addContent(types);
	  
      Element schema = new Element("schema");
      Namespace schemans = Namespace.getNamespace("http://www.w3.org/2001/XMLSchema");
      schema.setNamespace(schemans); 
      //schema.setAttribute("xmlns", "http://www.w3.org/2001/XMLSchema");
      schema.setAttribute("attributeFormDefault", "unqualified");
      schema.setAttribute("elementFormDefault", "unqualified");
      schema.setAttribute("targetNamespace", targetNamespace);
      types.addContent(schema);
      
      Element element = new Element("element",shcema);  
      element.setAttribute("name", "CaculatorProcessRequest");
      schema.addContent(element);
      
      Element ct = new Element("complexType",shcema);
      element.addContent(ct);
      
      Element seq = new Element("sequence",shcema);
      ct.addContent(seq);
      
      int num = wsdlpaths.size() ;
      for (int i = 1; i <= num; i++ )
      {
    	  Element ele = new Element("element",shcema);
          ele.setAttribute("name","input" + i);
          ele.setAttribute("type", "tns:web" + i);
          seq.addContent(ele); 
      }
      
      // ��� complexType
      index = 1;
      for(String path : wsdlpaths)
      {
    	  ct = new Element("complexType",shcema);
          ct.setAttribute("name", "web" + index);
          schema.addContent(ct);
          seq = new Element("sequence",shcema);
          ct.addContent(seq);
          try{
              Document jdoc=builder.build("file:"+ File.separator +path); 
              
    		  XPath xpath = XPath.newInstance("/ns:definitions/ns:portType/ns:operation/ns:input");
    		  xpath.addNamespace("ns",xmlns); 
    		  Element inputnode = (Element)xpath.selectSingleNode(jdoc);
              String messagename = inputnode.getAttributeValue("message");
              messagename = messagename.split(":")[1];

              xpath = XPath.newInstance("/ns:definitions/ns:message[@name='"+messagename+"']/ns:part");
    		  xpath.addNamespace("ns",xmlns); 
    		  Element message_part_node = (Element)xpath.selectSingleNode(jdoc);
              String elementname = message_part_node.getAttributeValue("element");
              System.out.println(elementname);  
              elementname = elementname.split(":")[1];    
                
              xpath = XPath.newInstance("/ns:definitions/ns:types/s:schema/s:element[@name='" + elementname + "']/s:complexType/s:sequence");
    		  xpath.addNamespace("ns",xmlns); 
    		  xpath.addNamespace("s","http://www.w3.org/2001/XMLSchema"); 
    		  Element schema_element_complexType_sequence = (Element)xpath.selectSingleNode(jdoc);
              List<Element> list = schema_element_complexType_sequence.getChildren();

              for(Element node : list){
                  Element ele = new Element("element",shcema);
                  List<Attribute> xAC = node.getAttributes();
                  for(Attribute xA : xAC){
                      if (xA.getValue().contains(":"))
                      {
                          ele.setAttribute(xA.getName(), xA.getValue().split(":")[1]);
                      }else{
                          ele.setAttribute(xA.getName(), xA.getValue());
                      }
                       
                  }
                  seq.addContent(ele);
              }
              index ++ ;
          }catch(Exception e){
        	  e.printStackTrace();
          }
      }// end of for
      
      //���element
      element = new Element("element",shcema);
      element.setAttribute("name", "CaculatorProcessResponse");
      schema.addContent(element);
      ct = new Element("complexType",shcema);
      element.addContent(ct);
      seq = new Element("sequence",shcema);  
      ct.addContent(seq);
      Element seq_ele = new Element("element",shcema);
      seq_ele.setAttribute("name","result");
      seq_ele.setAttribute("type", "string");
      seq.addContent(seq_ele);  
      
      //��� message
      Element message = new Element("message",xmlns); 
      message.setAttribute("name", "CaculatorProcessRequestMessage");
      definitions.addContent(message);

      Element part = new Element("part",xmlns);
      part.setAttribute("element", "tns:CaculatorProcessRequest");
      part.setAttribute("name", "payload");
      message.addContent(part);

      message = new Element("message",xmlns);
      message.setAttribute("name", "CaculatorProcessResponseMessage");
      definitions.addContent(message);  

      part = new Element("part",xmlns);  
      part.setAttribute("element", "tns:CaculatorProcessResponse");
      part.setAttribute("name", "payload");
      message.addContent(part);
      
      //���portType
      Element _portType = new Element("portType",xmlns);
      _portType.setAttribute("name", "CaculatorProcess");
      definitions.addContent(_portType);
      //���operation
      Element operation = new Element("operation",xmlns);
      operation.setAttribute("name", "caculator");
      _portType.addContent(operation);

      Element _input = new Element("input",xmlns);
      _input.setAttribute("message", "tns:CaculatorProcessRequestMessage");
      Element _output = new Element("output",xmlns);
      _output.setAttribute("message", "tns:CaculatorProcessResponseMessage");
      operation.addContent(_input);
      operation.addContent(_output);
      
      // ��� plnk
      Element _partnerLinkType = new Element("partnerLinkType","plnk",  plnk);
      _partnerLinkType.setAttribute("name", "CaculatorProcess");
      definitions.addContent(_partnerLinkType);
      
      Element _role = new Element("role","plnk",  plnk);
      _role.setAttribute("name", "CaculatorProcessProvider");
      _role.setAttribute("portType", "tns:CaculatorProcess");
      _partnerLinkType.addContent(_role);
      
      //��� binding
      Element binding = new Element("binding",xmlns);
      binding.setAttribute("name", "CaculatorProcessBinding");
      binding.setAttribute("type", "tns:CaculatorProcess");
      definitions.addContent(binding);
      
      Element _binding = new Element("binding","soap",  soap);
      _binding.setAttribute("style", "document");
      _binding.setAttribute("transport", "http://schemas.xmlsoap.org/soap/http");
      binding.addContent(_binding);

      Element _operation = new Element( "operation",xmlns); 
      _operation.setAttribute("name", "caculator");
      binding.addContent(_operation);

      Element soap_operation = new Element("operation","soap",  soap);
      //soap_operation.setAttribute("soapAction", "http://www.pku.edu.cn/bpel/sample/process");
      soap_operation.setAttribute("soapAction", targetNamespace);
      _operation.addContent(soap_operation);

      _input = new Element("input",xmlns);
      _operation.addContent(_input);
      
      Element body = new Element("body", "soap", soap);
      body.setAttribute("use","literal");
      _input.addContent(body);

      _output = new Element("output",xmlns);
      _operation.addContent(_output);
      body = new Element("body","soap",  soap);
      body.setAttribute("use", "literal");
      _output.addContent(body);
      
      
      // ��� service
      Element service = new Element("service",xmlns);
      service.setAttribute("name", "CaculatorProcess");
      definitions.addContent(service);

      Element port = new Element("port",xmlns);  
      port.setAttribute("binding", "tns:CaculatorProcessBinding");
      port.setAttribute("name", "CaculatorProcessPort");
      service.addContent(port);

      Element address = new Element("address","soap",  soap);  

      String addressUrl = "http://localhost:8080/ode/processes/CaculatorProcess" + longtime;
      address.setAttribute("location", addressUrl); 
      port.addContent(address);
         
      try {
	   	   Format format = Format.getCompactFormat();   
	       format.setEncoding("UTF-8");  
	       format.setIndent("  ");     
    	   
	       File f1 = new File(srcBasePath+ File.separator + longtime +"CaculatorProcessArtifacts.wsdl"); 
    	   XMLOutputter xo = new XMLOutputter(format);  
    	   FileWriter fw = new FileWriter(f1);
    	   xo.output(document, fw);
    	   fw.close();
     } catch (Exception e) {
    	   e.printStackTrace();
     }        
     return  longtime + "CaculatorProcessArtifacts.wsdl"; 
      
  } // end of function

	public String CreateBpelXML(String srcBasePath ,String mainwsdl, List<String>wsdlpaths){
		try{  
 			SAXBuilder builder = new SAXBuilder();
			String targetNamespace = null;    
            String suppressJoinFailure = "yes";
            String tns = null;
            String bpel = "http://docs.oasis-open.org/wsbpel/2.0/process/executable";
            String importType = "http://schemas.xmlsoap.org/wsdl/";
            String wsdl = "http://schemas.xmlsoap.org/wsdl/";
            String plnk = "http://docs.oasis-open.org/wsbpel/2.0/plnktype";
            String xsi = "http://www.w3.org/2001/XMLSchema-instance";  
            
            Document  mainWSDL =builder.build("file:"+ File.separator + mainwsdl); 
 		    XPath xpath = XPath.newInstance("/ns:definitions");
		    xpath.addNamespace("ns",wsdl);  
		    Element df =(Element) xpath.selectSingleNode(mainWSDL);
		    targetNamespace = df.getAttributeValue("targetNamespace");
            tns = targetNamespace;
            
            Element process = new Element("process","bpel",bpel);
            process.setAttribute("name", "CaculatorProcess");
            process.setAttribute("targetNamespace", targetNamespace);
            process.setAttribute("suppressJoinFailure", suppressJoinFailure);
           
            Namespace bpeltns = Namespace.getNamespace("bpel",bpel);  
            process.setNamespace(bpeltns);
                
            Namespace processtns = Namespace.getNamespace("tns",tns);
            process.addNamespaceDeclaration(processtns);
            
            List<Element> imports = null;
            xpath = XPath.newInstance("/ns:definitions/ns:import");
		    xpath.addNamespace("ns",wsdl);  
            imports = (List<Element>)xpath.selectNodes(mainWSDL);
            int index = 1;
            
            for (Element _import : imports)
            {
        	    Namespace nsi = Namespace.getNamespace("ns" + index,_import.getAttributeValue("namespace"));
        	    process.addNamespaceDeclaration(nsi);  
                index++;
            }
            Document bpelxml  = new Document(process);
            
            for (int i = 0; i < wsdlpaths.size(); i++)
            {
                Document WSDL = builder.build("file:"+ File.separator + wsdlpaths.get(i));  
                xpath = XPath.newInstance("/ns:definitions");
    		    xpath.addNamespace("ns",wsdl);  
                Element definition = (Element)xpath.selectSingleNode(WSDL);
                String _namespace = definition.getAttributeValue("targetNamespace");
                String[] _locations = wsdlpaths.get(i).split("\\\\");
                String _location = _locations[_locations.length - 1];
                Element _import = new Element("import","bpel",bpel);
                _import.setAttribute("namespace", _namespace);
                _import.setAttribute("location", _location);
                _import.setAttribute("importType", importType);

                process.addContent(_import);
            }
            
            Element partnerLinks = new Element("partnerLinks", "bpel", bpel);
            process.addContent(partnerLinks);
            
     	    xpath = XPath.newInstance("/default:definitions/plnk:partnerLinkType");    
		    xpath.addNamespace("plnk",plnk);  
		    xpath.addNamespace("default",wsdl);
            List<Element> partnerLinkTypes = ( List<Element>)xpath.selectNodes(mainWSDL);
            index = 0;
            
            for (Element _partnerLinkType : partnerLinkTypes)
            {
                Element role = _partnerLinkType.getChildren().get(0);
                String roleportype = role.getAttributeValue("portType");
                String[] temps = roleportype.split(":");
                List<Namespace> nss = df.getAdditionalNamespaces();
                String ts = null;
                for(Namespace ns : nss ){
                	if(ns.getPrefix().equals(temps[0])){
                		ts = ns.getURI();
                	}
                }
                String rolename = null;
                String _partnerLinkTypename = null;
            
                rolename = role.getAttributeValue("name");
                _partnerLinkTypename = _partnerLinkType.getAttributeValue("name");
                Element partnerLink = new Element("partnerLink", "bpel", bpel);
                if (ts.endsWith(tns))
                {
                    partnerLink.setAttribute("name", "client");
                    partnerLink.setAttribute("partnerLinkType", "tns:" + _partnerLinkTypename);
                    partnerLink.setAttribute("myRole", rolename);
                } 
                else
                {
                    partnerLink.setAttribute("name", _partnerLinkTypename.substring(0, _partnerLinkTypename.length() -1));
                    partnerLink.setAttribute("partnerLinkType", "tns:"+_partnerLinkTypename);
                    partnerLink.setAttribute("partnerRole", rolename);
                }
                partnerLinks.addContent(partnerLink);
                index++;
                
                
            }
            
            Element variables = new Element("variables", "bpel", bpel);
            process.addContent(variables);
            
            for (int i = 0; i < wsdlpaths.size(); i ++ )  
            {
                Document WSDL = builder.build("file:"+ File.separator + wsdlpaths.get(i));
                List<Element> messages = null;
                String _tns = null;
                xpath = XPath.newInstance("/ns:definitions");    
    		    xpath.addNamespace("ns",wsdl); 
                Element _df = (Element)xpath.selectSingleNode(WSDL);
                
                xpath = XPath.newInstance("/ns:definitions/ns:message");    
    		    xpath.addNamespace("ns",wsdl); 
                messages = (List<Element>)xpath.selectNodes(WSDL);
                _tns = _df.getAttributeValue("targetNamespace");
                
                List<Namespace> nss = process.getAdditionalNamespaces();
                String prefix = null;
                for(Namespace ns:nss){
                	if(ns.getURI().equals(_tns)){
                		prefix = ns.getPrefix();
                	}
                }
                for(Element message : messages){
                   String messagename = message.getAttributeValue("name");
                   String messageType = prefix + ":" + messagename;
                   Element variable = new Element("variable", "bpel", bpel);
                   variable.setAttribute("name",messagename + "_v"); 
                   variable.setAttribute("messageType", messageType);
                   variables.addContent(variable);
                }
            }
            
            Element sequence = new Element("sequence", "bpel", bpel);
            sequence.setAttribute("name","main");
            process.addContent(sequence);
            
            xpath = XPath.newInstance("/ns:definitions/ns:portType");
		    xpath.addNamespace("ns",wsdl);  
            Element portType = (Element)xpath.selectSingleNode(mainWSDL);
            
            xpath = XPath.newInstance("/ns:definitions/ns:portType/ns:operation");
		    xpath.addNamespace("ns",wsdl);  
            Element operation = (Element)xpath.selectSingleNode(mainWSDL);
            
            xpath = XPath.newInstance("/ns:definitions/ns:portType/ns:operation/ns:input");
		    xpath.addNamespace("ns",wsdl);  
            Element input = (Element)xpath.selectSingleNode(mainWSDL);
            
            xpath = XPath.newInstance("/ns:definitions/ns:portType/ns:operation/ns:output");
		    xpath.addNamespace("ns",wsdl);  
            Element output = (Element)xpath.selectSingleNode(mainWSDL);
            
            String MN = input.getAttributeValue("message");
            String Prefix = MN.split(":")[0];  
            String Name = MN.split(":")[1];
            String Prefix_Name = null;
            List<Namespace> nss = process.getAdditionalNamespaces();
  
            for(Namespace ns : nss){  

              	if(ns.getURI().equals(df.getAttributeValue("targetNamespace"))){
            		Prefix = ns.getPrefix();            
            	}  
            }         
            //System.out.println("test the getAttribute end:");  
            Element receive = new Element("receive", "bpel", bpel);
            
            xpath = XPath.newInstance("/ns:process/ns:variables/ns:variable");
		    xpath.addNamespace("ns",bpel); 
            List<Element> variablenodes = (List<Element>)xpath.selectNodes(bpelxml);
            receive.setAttribute("name", "receiveInput");
            receive.setAttribute("partnerLink", "client");
            receive.setAttribute("portType", Prefix + ":" + portType.getAttributeValue("name"));   
            receive.setAttribute("operation", operation.getAttributeValue("name"));
            
            xpath = XPath.newInstance("/ns:process/ns:variables/ns:variable[@messageType='" + MN + "']");
		    xpath.addNamespace("ns",bpel);   
            Element inputV = (Element)xpath.selectSingleNode(bpelxml);
            String inputVName = inputV.getAttributeValue("name");
            receive.setAttribute("variable", inputVName);    
            
            receive.setAttribute("createInstance", "yes");
            sequence.addContent(receive); 
            
            Element reply = new Element("reply", "bpel", bpel);
            reply.setAttribute("name", "replyOutput");
            reply.setAttribute("partnerLink", "client");
            reply.setAttribute("portType", Prefix + ":" + portType.getAttributeValue("name"));
            reply.setAttribute("operation", operation.getAttributeValue("name"));
            
            xpath = XPath.newInstance("/ns:process/ns:variables/ns:variable[@messageType='" + output.getAttributeValue("message")+ "']");
		    xpath.addNamespace("ns",bpel); 
            Element outputV = (Element)xpath.selectSingleNode(bpelxml);
            String outputVName = outputV.getAttributeValue("name");
            
            reply.setAttribute("variable", outputVName);
            
            
            index = 1;
            for (String path : wsdlpaths)
            {
                if (path.equals(mainwsdl))
                {
                    continue;
                } 
                else
                {
                	 Element assign = new Element("assign", "bpel", bpel);
                     
                     assign.setAttribute("validate", "no");
                     assign.setAttribute("name", "Assign" + index);
                     sequence.addContent(assign);
                     Element copy = new Element("copy", "bpel", bpel);
                     assign.addContent(copy);
                     Element from = new Element("from", "bpel", bpel);
                     copy.addContent(from);
                     Element literal = new Element("literal", "bpel", bpel);
                     
         
                     Attribute a = new Attribute("space","preserve"); 
                     a.setNamespace(Namespace.XML_NAMESPACE);
                     literal.setAttribute(a);
                     from.addContent(literal);
                     
                     Document WSDL = builder.build("file:"+ File.separator + path);
                     
                     xpath = XPath.newInstance("/ns:definitions");
         		     xpath.addNamespace("ns",wsdl); 
         		     df = (Element)xpath.selectSingleNode(WSDL);
                     targetNamespace = df.getAttributeValue("targetNamespace");
                     tns = targetNamespace;
                     
                     xpath = XPath.newInstance("/ns:definitions/ns:portType/ns:operation/ns:input");
         		     xpath.addNamespace("ns",wsdl); 
                     input = (Element)xpath.selectSingleNode(WSDL);
                     MN = input.getAttributeValue("message");
                     MN = MN.split(":")[1];
                     
                     xpath = XPath.newInstance("/ns:definitions/ns:message[@name='" + MN + "']/ns:part");
         		     xpath.addNamespace("ns",wsdl); 
                     Element message_part_node = (Element)xpath.selectSingleNode(WSDL);
                     String elementname = message_part_node.getAttributeValue("element");
                     elementname = elementname.split(":")[1];
                     
                     
                     Element tempMessage = new Element(elementname,"tns" , tns);
                     Namespace _tns = Namespace.getNamespace("tns",tns);  
                     tempMessage.addNamespaceDeclaration(_tns);
                     Namespace _xsi = Namespace.getNamespace("xsi",xsi);  
                     tempMessage.addNamespaceDeclaration(_xsi);
                     literal.addContent(tempMessage);
                     
                     
                     xpath = XPath.newInstance("/ns:definitions/ns:types/s:schema/s:element[@name='" + elementname + "']/s:complexType/s:sequence");
         		     xpath.addNamespace("ns",wsdl); 
         		     xpath.addNamespace("s", "http://www.w3.org/2001/XMLSchema");  
                     Element schema_element_complexType_sequence = (Element)xpath.selectSingleNode(WSDL);
                     List<Element> list = schema_element_complexType_sequence.getChildren();
                     
                     
                     for (Element ele : list)
                     {
                         String myname = ele.getAttributeValue("name");
                         Element tempElement = new Element(myname,"tns" , tns);
                         tempElement.setText("whu.edu.cn");
                         tempMessage.addContent(tempElement);
                     }
                     
                     
                     Element to = new Element("to", "bpel", bpel);
                     String to_part = message_part_node.getAttributeValue("name");
                     String to_variable = null;
                     for(Element va : variablenodes){
                         String messageType = va.getAttributeValue("messageType");
                         messageType = messageType.split(":")[1];
                         if (messageType.equals(MN))
                         {
                             to_variable =  va.getAttributeValue("name");
                             to.setAttribute("part", to_part);
                             to.setAttribute("variable", to_variable);
                             break; 
                         }
                     }
                     copy.addContent(to);
                     
                     
                     xpath = XPath.newInstance("/ns:definitions/ns:portType/ns:operation/ns:input");
         		     xpath.addNamespace("ns",wsdl); 
                     input = (Element)xpath.selectSingleNode(mainWSDL);
                     MN = input.getAttributeValue("message");
                     MN = MN.split(":")[1];
                     
                     xpath = XPath.newInstance("/ns:definitions/ns:message[@name='" + MN + "']/ns:part");
         		     xpath.addNamespace("ns",wsdl); 
                     message_part_node = (Element)xpath.selectSingleNode(mainWSDL);
                     elementname = message_part_node.getAttributeValue("element");
                     elementname = elementname.split(":")[1];
                     
                     xpath = XPath.newInstance("/ns:definitions/ns:types/s:schema/s:element[@name='" + elementname + "']/s:complexType/s:sequence");
         		     xpath.addNamespace("ns",wsdl); 
         		     xpath.addNamespace("s", "http://www.w3.org/2001/XMLSchema");  
                     schema_element_complexType_sequence = (Element)xpath.selectSingleNode(mainWSDL);
                     list = schema_element_complexType_sequence.getChildren();
                     
                     
                     Element ele0 = list.get(index-1);
                     String inputname = ele0.getAttributeValue("name");
                     String inputtype = ele0.getAttributeValue("type");
                     inputtype = inputtype.split(":")[1];
                     xpath = XPath.newInstance("/ns:definitions/ns:types/s:schema/s:complexType[@name='" + inputtype + "']/s:sequence");
         		     xpath.addNamespace("ns",wsdl);
         		     xpath.addNamespace("s", "http://www.w3.org/2001/XMLSchema");    
                     Element inputtypeNode = (Element)xpath.selectSingleNode(mainWSDL);
                     
                     
                     for (Element node : inputtypeNode.getChildren())
                     {
                         copy = new Element("copy", "bpel", bpel);
                         assign.addContent(copy);
                         from = new Element("from", "bpel", bpel);
                         from.setAttribute("part", "payload");
                         from.setAttribute("variable", inputVName);
                         copy.addContent(from);
                         Element query = new Element("query", "bpel", bpel);
                         query.setAttribute("queryLanguage", "urn:oasis:names:tc:wsbpel:2.0:sublang:xpath1.0");
                         CDATA xc = new CDATA("tns:"+ inputname + "/"  + "tns:"+ node.getAttributeValue("name"));

                         query.addContent(xc); 
                         from.addContent(query); 

                         to = new Element("to", "bpel", bpel);
                         to.setAttribute("part", to_part);  
                         to.setAttribute("variable", to_variable);

                         copy.addContent(to);
                         query = new Element("query", "bpel", bpel);
                         query.setAttribute("queryLanguage", "urn:oasis:names:tc:wsbpel:2.0:sublang:xpath1.0");
                         
                         List<Namespace> tempnss = process.getAdditionalNamespaces();
                         for(Namespace tempns : tempnss){
                        	 if(tempns.getURI().equals(targetNamespace)){
                        		 xc = new CDATA(tempns.getPrefix() + ":" + node.getAttributeValue("name"));
                        	 }
                         }
                         query.addContent(xc);
                         to.addContent(query);
 
                     }
                     
                     // begin invoke 
                     Element invoke = new Element("invoke","bpel",bpel);
                     sequence.addContent(invoke);
                     
                     
                     xpath = XPath.newInstance("/ns:definitions/ns:portType");
         		     xpath.addNamespace("ns",wsdl); 
                     portType = (Element)xpath.selectSingleNode(WSDL);
                     String portTypeName = portType.getAttributeValue("name");
                     
                     
                     xpath = XPath.newInstance("/ns:definitions/ns:portType/ns:operation");
         		     xpath.addNamespace("ns",wsdl); 
                     operation = (Element)xpath.selectSingleNode(WSDL);
                     String operationName = operation.getAttributeValue("name");
                     
                     
                     xpath = XPath.newInstance("/ns:definitions/ns:portType/ns:operation/ns:input");
         		     xpath.addNamespace("ns",wsdl); 
                     input = (Element)xpath.selectSingleNode(WSDL);
                     inputname = input.getAttributeValue("message");
                     inputname = inputname.split(":")[1];
                     
                     
                     xpath = XPath.newInstance("/ns:definitions/ns:portType/ns:operation/ns:output");
         		     xpath.addNamespace("ns",wsdl); 
                     output = (Element)xpath.selectSingleNode(WSDL);
                     String outputname = output.getAttributeValue("message");
                     outputname = outputname.split(":")[1]; 
                     
                     List<Namespace> tempnss = process.getAdditionalNamespaces();
                     for(Namespace tempns : tempnss){
                    	 if(tempns.getURI().equals(targetNamespace)){
                    		 Prefix_Name = tempns.getPrefix();
                    	 }
                     }
                     portTypeName = Prefix_Name + ":" +portTypeName;
                     invoke.setAttribute("name", operationName);
                     invoke.setAttribute("operation", operationName);
                     invoke.setAttribute("portType", portTypeName);
                     
                     
                     xpath = XPath.newInstance("/ns:definitions");
         		     xpath.addNamespace("ns",wsdl); 
                     df = (Element)xpath.selectSingleNode(mainWSDL);
                     tempnss = df.getAdditionalNamespaces();
                     for(Namespace tempns : tempnss){
                    	 if(tempns.getURI().equals(targetNamespace)){
                    		 Prefix_Name = tempns.getPrefix();
                    	 }
                     }
                     portTypeName = Prefix_Name + ":" + portType.getAttributeValue("name");
                     
                     
                     xpath = XPath.newInstance("/ns:definitions/plnk:partnerLinkType/plnk:role[@portType='" + portTypeName + "']");
         		     xpath.addNamespace("ns",wsdl); 
         		     xpath.addNamespace("plnk",plnk);   
                     Element partnerLink_node = (Element)xpath.selectSingleNode(mainWSDL);
                     String roleName = partnerLink_node.getAttributeValue("name");
                     Element parent = (Element)partnerLink_node.getParent();
                     String partnerLinkType = parent.getAttributeValue("name");
                     
                     
                     xpath = XPath.newInstance("/ns:process/ns:partnerLinks/ns:partnerLink[@partnerRole='" + roleName + "']");
         		     xpath.addNamespace("ns",bpel); 
                     Element partnerLink = (Element)xpath.selectSingleNode(bpelxml);
                     String  partnerLink_Name = partnerLink.getAttributeValue("name");
                     invoke.setAttribute("partnerLink", partnerLink_Name);
                     
                     
                     tempnss = process.getAdditionalNamespaces();
                     for(Namespace tempns : tempnss){
                    	 if(tempns.getURI().equals(targetNamespace)){
                    		 Prefix_Name = tempns.getPrefix();
                    	 }
                     }
                     inputname = Prefix_Name + ":" + inputname;
                     outputname = Prefix_Name + ":" + outputname;
                     xpath = XPath.newInstance("/ns:process/ns:variables/ns:variable[@messageType='" + inputname + "']");
         		     xpath.addNamespace("ns",bpel); 
                     Element inputVariable = (Element)xpath.selectSingleNode(bpelxml);
                     String inputVariableName = inputVariable.getAttributeValue("name");
                     
                     xpath = XPath.newInstance("/ns:process/ns:variables/ns:variable[@messageType='" + outputname + "']");
         		     xpath.addNamespace("ns",bpel); 
                     Element outputVariable = (Element)xpath.selectSingleNode(bpelxml);
                     String outputVariableName = outputVariable.getAttributeValue("name");
                     invoke.setAttribute("inputVariable", inputVariableName);
                     invoke.setAttribute("outputVariable", outputVariableName);  


                     index ++ ;
                } // end of else 
                
            } // end of for
            
            Element lastassign = new Element("assign", "bpel", bpel);
            lastassign.setAttribute("validate", "no" );
            lastassign.setAttribute("name", "Assign" + index);
            sequence.addContent(lastassign);
            Element lastcopy = new Element("copy", "bpel", bpel);
            lastassign.addContent(lastcopy);
            Element lastfrom = new Element("from", "bpel", bpel);
            lastcopy.addContent(lastfrom);
            Element lastliteral = new Element("literal", "bpel", bpel);
          
            Attribute a = new Attribute("space","preserve"); 
            a.setNamespace(Namespace.XML_NAMESPACE);
            lastliteral.setAttribute(a);
            lastfrom.addContent(lastliteral);
            
            xpath = XPath.newInstance("/ns:definitions/ns:portType/ns:operation/ns:output");
		    xpath.addNamespace("ns",wsdl); 
            Element operation_output = (Element)xpath.selectSingleNode(mainWSDL);
            String operation_output_messageName = operation_output.getAttributeValue("message");
            operation_output_messageName = operation_output_messageName.split(":")[1];
            
            
            xpath = XPath.newInstance("/ns:definitions/ns:message[@name='" + operation_output_messageName + "']/ns:part");
		    xpath.addNamespace("ns",wsdl); 
            Element message_partnode = (Element)xpath.selectSingleNode(mainWSDL);
            String message_elementname = message_partnode.getAttributeValue("element");
            message_elementname = message_elementname.split(":")[1];
            String message_partname = message_partnode.getAttributeValue("name");
            
            
            xpath = XPath.newInstance("/ns:definitions");
		    xpath.addNamespace("ns",wsdl); 
            df = (Element)xpath.selectSingleNode(mainWSDL);
            targetNamespace = df.getAttributeValue("targetNamespace");
            Element lastMessage = new Element(message_elementname,"tns" , targetNamespace);
            Namespace _tns = Namespace.getNamespace("tns",targetNamespace);  
            lastMessage.addNamespaceDeclaration(_tns);
            Namespace _xsi = Namespace.getNamespace("xsi",xsi);  
            lastMessage.addNamespaceDeclaration(_xsi);
            lastliteral.addContent(lastMessage);
            
            
            xpath = XPath.newInstance("/ns:definitions/ns:types/s:schema/s:element[@name='" + message_elementname + "']/s:complexType/s:sequence");
		    xpath.addNamespace("ns",wsdl); 
		    xpath.addNamespace("s", "http://www.w3.org/2001/XMLSchema");    
            Element element_complexType_sequence = (Element)xpath.selectSingleNode(mainWSDL);
            List<Element> nodelist = element_complexType_sequence.getChildren();
            
            
            for (Element ele : nodelist)
            {
                String myname = ele.getAttributeValue("name");
                Element tempElement = new  Element(myname,"tns", targetNamespace);
                tempElement.setText("whu.edu.cn");
                lastMessage.addContent(tempElement);
            }
            
            Element lastto = new Element("to","bpel",  bpel);
            lastto.setAttribute("part", message_partname);
            lastto.setAttribute("variable",outputVName);
            lastcopy.addContent(lastto);
            sequence.addContent(reply);
            
            
           Format format = Format.getCompactFormat();   
           format.setEncoding("utf-8");  
           format.setIndent("  ");       

           File f1 = new File(srcBasePath + File.separator +  longtime +"CaculatorProcess.bpel");  
     	   XMLOutputter xo = new XMLOutputter(format);
     	   FileWriter fw = new FileWriter(f1);
     	   xo.output(bpelxml, fw);
     	   fw.close();   
		}catch(Exception e){  
			e.printStackTrace();
		}      
		return  longtime + "CaculatorProcess.bpel"; 
	}

	public String CreateDeployXML(String srcBasePath ,String bpelpath, List<String>   wsdlpaths){
      try{
    	   SAXBuilder builder = new SAXBuilder();
           String deployxmlNS =  "http://www.apache.org/ode/schemas/dd/2007/03";
           String bpelxmlNS = "http://docs.oasis-open.org/wsbpel/2.0/process/executable";
           String plnk = "http://docs.oasis-open.org/wsbpel/2.0/plnktype";
           String wsdl = "http://schemas.xmlsoap.org/wsdl/";
          
           Element deploy = new Element("deploy");
           Namespace deployxmlns = Namespace.getNamespace(deployxmlNS);
           deploy.setNamespace(deployxmlns);
          
    	   Document  bpelxml =builder.build("file:"+ File.separator + bpelpath); 
		   XPath xpath = XPath.newInstance("/bpel:process/bpel:import");
		   xpath.addNamespace("bpel",bpelxmlNS);  
		   List<Element> imports = (List<Element>)xpath.selectNodes(bpelxml);
		   int index = 0;
           for(Element _import : imports)
           {
       	       Namespace nsi = Namespace.getNamespace("ns" + index,_import.getAttributeValue("namespace"));
       	       deploy.addNamespaceDeclaration(nsi);  
               index++;
           }
           Document deployxml = new Document(deploy);  
           
           Element process = new Element("process",deployxmlns);
           xpath = XPath.newInstance("/bpel:process");
		   xpath.addNamespace("bpel",bpelxmlNS);
		   Element _process = (Element)xpath.selectSingleNode(bpelxml);
           String temp = _process.getAttributeValue("targetNamespace");
           List<Namespace> nss = deploy.getAdditionalNamespaces();
           String processtemp = null;
           for(Namespace np : nss){
        	   if(np.getURI().equals(temp)){
        		   processtemp = np.getPrefix();
        	   }
           }
           process.setAttribute("name",processtemp + ":" + _process.getAttributeValue("name"));
           
           deploy.addContent(process);
           Element active = new Element("active",deployxmlns);
           active.setText("true");
           process.addContent(active);
           
           Element retired = new Element("retired",deployxmlns);
           retired.setText("false");
           process.addContent(retired);
           
           Element process_events = new Element("process-events",deployxmlns);
           process_events.setAttribute("generate","all");
           process.addContent(process_events);
           
           Element provide = new Element("provide",deployxmlns);
           xpath = XPath.newInstance("/bpel:process/bpel:partnerLinks/bpel:partnerLink");
		   xpath.addNamespace("bpel",bpelxmlNS);
		   List<Element> partnerLinks = (List<Element>)xpath.selectNodes(bpelxml); 
           
           for (int i = 0; i < partnerLinks.size(); i++ )
           {
               Element partnerLink = partnerLinks.get(i);
               int flag = 0;
               for (int j = 0; j < partnerLink.getAttributes().size(); j++ )
               {
                   if (partnerLink.getAttributes().get(j).getName().equals("myRole") )
                   {
                       String name = partnerLink.getAttributeValue("name");
                       provide.setAttribute("partnerLink",name);
                       flag = 1;
                       break;
                   }
               }// end of for
               if (flag == 1) {
                   break;
               }       
           }
           
           Element service = new Element("service",deployxmlns);
           Document mainWSDL = null;
           for(String wsdlpath : wsdlpaths){
        	   mainWSDL =builder.build("file:"+ File.separator + wsdlpath); 
    		   xpath = XPath.newInstance("/ns:definitions");
    		   xpath.addNamespace("ns",wsdl);  
    		   Element definition = (Element)xpath.selectSingleNode(mainWSDL);
    		   String targetNamespace = definition.getAttributeValue("targetNamespace");
    		   String temp0 = _process.getAttributeValue("targetNamespace");
    		   String servicename = null;
               String serviceport = null;
               if (targetNamespace.equals(temp0))
               {
            	   xpath = XPath.newInstance("/ns:definitions/ns:service");
        		   xpath.addNamespace("ns",wsdl);
        		   Element ds = (Element)xpath.selectSingleNode(mainWSDL);
        		   servicename = ds.getAttributeValue("name");

            	   xpath = XPath.newInstance("/ns:definitions/ns:service/ns:port");
        		   xpath.addNamespace("ns",wsdl);
        		   Element dsp = (Element)xpath.selectSingleNode(mainWSDL);
        		   serviceport = dsp.getAttributeValue("name");
                   
        		   List<Namespace> tempns = deploy.getAdditionalNamespaces();
        		   String processtemp0 = null;
        		   for(Namespace tempn :tempns){
        			   if(tempn.getURI().equals(temp0)){
        				   processtemp0 = tempn.getPrefix();
        			   }
        		   }
                   service.setAttribute("name", processtemp0 + ":" + servicename);
                   service.setAttribute("port", serviceport);
                   break;
               }
            
           }
           provide.addContent(service);
           process.addContent(provide);   
           for(int i = 0; i<partnerLinks.size(); i++){
        	   Element partnerLink = partnerLinks.get(i);
        	   for(int j= 0; j<partnerLink.getAttributes().size();j++){
        		   if(partnerLink.getAttributes().get(j).getName().equals("partnerRole")){
        			  Element invoke = new Element("invoke",deployxmlns);
        			  String name = partnerLink.getAttributeValue("name");
        			  invoke.setAttribute("partnerLink",name);
        			  
        			  String partnerRole = partnerLink.getAttributeValue("partnerRole");
        			  
        			  Element service0 = new Element("service",deployxmlns);  
               	      xpath = XPath.newInstance("/default:definitions/plnk:partnerLinkType/plnk:role");    
        		      xpath.addNamespace("plnk",plnk);  
        		      xpath.addNamespace("default",wsdl);
                      List<Element> partnerRoles = (List<Element>)xpath.selectNodes(mainWSDL);
                        
                      for(Element _partnerRole : partnerRoles){
                    	  if(_partnerRole.getAttributeValue("name").equals(partnerRole)){
                    		  String portype = _partnerRole.getAttributeValue("portType");
                              String [] temps = portype.split(":");
                              
                       	      xpath = XPath.newInstance("/default:definitions");
                       	      xpath.addNamespace("default",wsdl);
                              Element def = (Element)xpath.selectSingleNode(mainWSDL);
                              List<Namespace> nns = def.getAdditionalNamespaces();
                              String targetNamespace = null;
                              for(Namespace ns: nns){
                            	  if(ns.getPrefix().equals(temps[0])){
                            		  targetNamespace = ns.getURI();
                            	  }
                              }
                              for (int c = 0; c < wsdlpaths.size(); c ++ )
                              {
                            	  Document otherWSDL =builder.build("file:"+ File.separator + wsdlpaths.get(c)); 
                       		      xpath = XPath.newInstance("/ns:definitions");
                       		      xpath.addNamespace("ns",wsdl);  
                            	  

                                  Element definition = (Element)xpath.selectSingleNode(otherWSDL);
                                  String tns = definition.getAttributeValue("targetNamespace");
                                  String servicename = null;
                                  String serviceport = null; 
                                  if (tns.equals(targetNamespace))
                                  {
                                	  xpath = XPath.newInstance("/ns:definitions/ns:service");
                           		      xpath.addNamespace("ns",wsdl);  
                           		      Element ds = (Element)xpath.selectSingleNode(otherWSDL);
                           		      servicename = ds.getAttributeValue("name");
                           		      
                                	  xpath = XPath.newInstance("/ns:definitions/ns:service/ns:port");
                           		      xpath.addNamespace("ns",wsdl);  
                           		      Element dsp = (Element)xpath.selectSingleNode(otherWSDL);
                           		      serviceport = dsp.getAttributeValue("name");
                           		      
                           		      List<Namespace> dpns = deploy.getAdditionalNamespaces();
                           		      String prefix = null;
                           		      for(Namespace dpn : dpns){
                           		    	  if(dpn.getURI().equals(targetNamespace)){
                           		    		prefix = dpn.getPrefix();
                           		    	  }
                           		      }
                                      service0.setAttribute("name", prefix +":" + servicename);
                                      service0.setAttribute("port", serviceport);
                                      break;
                                  }
                              }
                              break;

                    	  }
                      }
                      invoke.addContent(service0);
                      process.addContent(invoke);
        		   }
        	   }
           }// end of for
           try {
        	   Format format = Format.getCompactFormat();   
    	       format.setEncoding("UTF-8");  
    	       format.setIndent("  ");     
        	   
    	       File f1 = new File(srcBasePath + File.separator + longtime +"deploy.xml");  
        	   XMLOutputter xo = new XMLOutputter(format);  
        	   FileWriter fw = new FileWriter(f1);
        	   xo.output(deployxml, fw);
        	   fw.close();
         } catch (Exception e) {
        	   e.printStackTrace();
         }
      }catch(Exception e){
    	  e.printStackTrace();
      }
          
      return  longtime + "deploy.xml"; 
  }

}
