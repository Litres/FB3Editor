/**
 * Элемент marker.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.marker.MarkerElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.element.marker.img.ImgElement'
		],
		htmlTag: 'marker',
		xmlTag: 'marker',
		cls: 'el-marker',

		/**
		 * @property {FBEditor.editor.element.marker.img.ImgElement} Изображение маркера.
		 */
		img: null,

		/**
		 * @property {Boolean} Маркер ли.
		 */
		isMarker: true,

		constructor: function ()
		{
			var me = this,
				img;

			me.callParent(arguments);
			img = me.children[0];
			me.children = [];
			me.img = Ext.create('FBEditor.editor.element.marker.img.ImgElement', img.attributes);
			me.img.parent = me;
		},

		getNode: function (viewportId)
		{
			var me = this,
				tag = me.htmlTag,
				node;

			node = document.createElement(tag);
			node.viewportId = viewportId;
			me.setNode(node);
			node.appendChild(me.img.getNode(viewportId));

			return node;
		},

		getXml: function ()
		{
			var me = this,
				tag = me.xmlTag,
				xml,
				attr;

			attr = me.getAttributesXml();
			xml = '<' + tag;
			xml += attr ? ' ' + attr : '';
			
			if (me.img)
			{
				xml += '>' + me.img.getXml() + '</' + tag + '>';
			}
			else
			{
				xml += '/>';
			}

			return xml;
		},

		setNode: function (node)
		{
			var me = this;

			me.callParent(arguments);
			node.getElement = function ()
			{
				// ссылается на элемент, который содержит маркер
				return me.parent;
			};
		}
	}
);