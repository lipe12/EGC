package cn.com.bean;

/**
 * @author Houzw
 * @Description ExtJs Tree Json attributes
 * @Createdate 2016年7月27日 下午7:03:05
 */
public class ExtTree
{
	/** 树节点名称 */
	private String text;
	/** 图标 icon class */
	private String cls;
	/** 是否叶子 */
	private boolean leaf;
	/** 链接 */
	private String href;
	/** 链接指向 */
	private String hrefTarget;
	/** 是否展开 */
	private boolean expandable;
	/** 描述信息 */
	private String description;
	/** 树节点 node ID */
	private String id;

	/**
	 * @return the id
	 */
	public String getId()
	{
		return id;
	}

	/**
	 * @param id the id to set
	 */
	public void setId(String id)
	{
		this.id = id;
	}

	/**
	 * @return the text
	 */
	public String getText()
	{
		return text;
	}

	/**
	 * @param text the text to set
	 */
	public void setText(String text)
	{
		this.text = text;
	}

	/**
	 * @return the cls
	 */
	public String getCls()
	{
		return cls;
	}

	/**
	 * @param cls the cls to set
	 */
	public void setCls(String cls)
	{
		this.cls = cls;
	}

	/**
	 * @return the leaf
	 */
	public boolean isLeaf()
	{
		return leaf;
	}

	/**
	 * @param leaf the leaf to set
	 */
	public void setLeaf(boolean leaf)
	{
		this.leaf = leaf;
	}

	/**
	 * @return the href
	 */
	public String getHref()
	{
		return href;
	}

	/**
	 * @param href the href to set
	 */
	public void setHref(String href)
	{
		this.href = href;
	}

	/**
	 * @return the hrefTarget
	 */
	public String getHrefTarget()
	{
		return hrefTarget;
	}

	/**
	 * @param hrefTarget the hrefTarget to set
	 */
	public void setHrefTarget(String hrefTarget)
	{
		this.hrefTarget = hrefTarget;
	}

	/**
	 * @return the expandable
	 */
	public boolean isExpandable()
	{
		return expandable;
	}

	/**
	 * @param expandable the expandable to set
	 */
	public void setExpandable(boolean expandable)
	{
		this.expandable = expandable;
	}

	/**
	 * @return the description
	 */
	public String getDescription()
	{
		return description;
	}

	/**
	 * @param description the description to set
	 */
	public void setDescription(String description)
	{
		this.description = description;
	}

}
