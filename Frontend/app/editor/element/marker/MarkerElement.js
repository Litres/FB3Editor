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

		getXml: function (withoutText, withoutFormat)
		{
			var me = this,
				self = FBEditor.editor.element.AbstractElement,
				img = me.img,
				tag = me.xmlTag,
				nlBefore = '',
				nlAfter = '',
				spacesBefore = '',
				spacesAfter = '',
				formatOptions = {},
				xml,
				attr;
			
			self.countSpaces++;
			
			if (!withoutFormat)
			{
				// получаем опции для форматирования xml
				formatOptions = me.getFormatOptionsXml();
				spacesBefore = formatOptions.spacesBefore;
				spacesAfter = formatOptions.spacesAfter;
				nlBefore = formatOptions.nlBefore;
				nlAfter = formatOptions.nlAfter;
			}
			
			attr = me.getAttributesXml();
			xml = spacesBefore + '<' + tag;
			xml += attr ? ' ' + attr : '';
			
			if (img)
			{
				self.countSpaces++;
				xml += '>' + nlBefore;
				xml += img.getXml(withoutText, withoutFormat);
				xml += spacesAfter + '</' + tag + '>' + nlAfter;
				self.countSpaces--;
				
			}
			else
			{
				xml += '/>' + nlAfter;
			}
			
			self.countSpaces--;

			return xml;
		},

		setNode: function (node)
		{
			var me = this,
				parent = me.parent;

			me.callParent(arguments);
			
			node.getElement = function ()
			{
				// ссылается на элемент, который содержит маркер
				return parent;
			};
		},

		initCls: function ()
		{
			var me = this,
				parent = me.parent,
				first = parent.first(),
				markerCls,
				nextName;

			// класс маркера
			nextName = first.getName();
			markerCls = 'el-marker-' + nextName;
			me.baseCls = markerCls;

			me.callParent(arguments);
		}
	}
);