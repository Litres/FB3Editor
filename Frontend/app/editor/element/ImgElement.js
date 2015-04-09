/**
 * Элемент img.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.ImgElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',

		htmlTag: 'img',
		xmlTag: 'img',

		/**
		 * @property {FBEditor.resource.Resource} Ссылка на ресурс.
		 */
		resource: null,

		getNode: function ()
		{
			var me = this,
				node;

			me.linkResource();
			node = me.callParent(arguments);

			return node;
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