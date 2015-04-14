/**
 * Элемент изображения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.ImgElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',

		htmlTag: 'img',
		xmlTag: 'img',
		cls: 'el-img',
		attributes: {
			tabindex: 0
		},

		/**
		 * @property {FBEditor.resource.Resource} Ссылка на ресурс.
		 */
		resource: null,

		constructor: function (attributes, children)
		{
			var me = this;

			me.children = children || me.children;
			me.attributes = Ext.apply(attributes, me.attributes);
		},

		clear: function ()
		{
			var me = this,
				resource = me.resource;

			resource.removeElement(me);
			me.callParent();
		},

		getNode: function ()
		{
			var me = this,
				node;

			me.linkResource();
			node = me.callParent(arguments);

			return node;
		},

		getAttributesXml: function ()
		{
			var me = this,
				attributes = Ext.clone(me.attributes),
				attr = '';

			attributes.src = me.resource.name;
			Ext.Object.each(
				attributes,
				function (key, val)
				{
					attr += key + '="' + val + '" ';
				}
			);

			return attr;
		},

		setStyleHtml: function ()
		{
			var me = this,
				attributes = me.attributes,
				style;

			style = me.callParent();
			style += style ? ' ' : '';
			style += attributes.width ? 'width: ' + attributes.width + '; ' : '';
			style += attributes['min-width'] ? 'min-width: ' + attributes['min-width'] + '; ' : '';
			me.style = style;

			return style;
		},

		/**
		 * Удаляет связь изображения с ресурсом.
		 */
		deleteLinkResource: function ()
		{
			var me = this,
				nodes = me.nodes;

			me.resource = null;
			Ext.Object.each(
				nodes,
			    function (id, node)
			    {
				    me.attributes.src = 'undefined';
				    node.setAttribute('src', 'undefined');
				    //node.parentNode.removeChild(node);
			    }
			);
		},

		/**
		 * @private
		 * Связывает изображение с ресурсом.
		 */
		linkResource: function ()
		{
			var me = this,
				attributes = me.attributes,
				resource = me.resource;

			if (!resource)
			{
				resource = FBEditor.resource.Manager.getResourceByName(attributes.src);
				attributes.src = resource.url;
				resource.addElement(me);
				me.resource = resource;
			}
		}
	}
);