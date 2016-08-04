package cn.com.bean;
import java.util.ArrayList;
import java.util.List;
public class TreeData {

	private String id;
	private String text;
	private boolean leaf;
	public List<TreeData> children = new ArrayList<TreeData>();
	public List<TreeData> getChildren() {
		return children;
	}
	public void setChildren(List<TreeData> children) {
		this.children = children;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public boolean isLeaf() {
		return leaf;
	}
	public void setLeaf(boolean leaf) {
		this.leaf = leaf;
	}
}
