/**
 * Класс абстрактого элемента.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.AbstractElement',
	{
		extend: 'FBEditor.editor.element.InterfaceElement',

		/**
		 * @property {FBEditor.editor.element.AbstractElement[]} [children] Дочерние элементы.
		 */
		children: null,

		/**
		 * @property {Object} attributes Атрибуты элемента.
		 */
		attributes: {},

		/**
		 * @property {String} Имя тега для отображения в html.
		 */
		htmlTag: 'div',

		/**
		 * @property {String} Имя тега в xml.
		 */
		xmlTag: 'div',

		/**
		 * @property {String} Строка стилей.
		 */
		style: '',

		baseCls: '',

		cls: '',

		/**
		 * @param {Object} attributes Атрибуты элемента.
		 * @param {FBEditor.editor.element.AbstractElement[]|null} [children] Дочерние элементы.
		 */
		constructor: function (attributes, children)
		{
			var me = this;

			me.children = children || me.children;
			me.attributes = attributes || me.attributes;
		},

		getHtml: function ()
		{
			var me = this,
				children = me.children,
				nt = me.htmlTag,
				html,
				attr;

			attr = me.getAttributesHtml();
			html = '<' + nt;
			html += attr ? ' ' + attr : '';
			if (children.length)
			{
				html += '>';
				Ext.Array.each(
					children,
					function (item)
					{
						html += item.getHtml();
					}
				);
				html += '</' + nt + '>';
			}
			else
			{
				html += '/>';
			}

			return html;
		},

		getXml: function ()
		{
			var me = this,
				children = me.children,
				tag = me.xmlTag,
				xml,
				attr;

			attr = me.getAttributesXml();
			xml = '<' + tag;
			xml += attr ? ' ' + attr : '';
			if (children.length)
			{
				xml += '>';
				Ext.Array.each(
					children,
					function (item)
					{
						xml += item.getXml();
					}
				);
				xml += '</' + tag + '>';
			}
			else
			{
				xml += '/>';
			}

			return xml;
		},

		/**
		 * @private
		 * Возвращает строку атрибутов элементов для отображения в html.
		 * @return {String} Строка атрибутов.
		 */
		getAttributesHtml: function ()
		{
			var me = this,
				attr = '';

			Ext.Object.each(
				me.attributes,
			    function (key, val)
			    {
				    attr += key + '="' + val + '" ';
			    }
			);
			attr += me.style ? 'style="' + me.style + '"' : '';
			attr += me.baseCls || me.cls ? 'class="' + me.baseCls + ' ' + me.cls + '"' : '';

			return attr;
		},

		/**
		 * @private
		 * Возвращает строку атрибутов элементов для xml.
		 * @return {String} Строка атрибутов.
		 */
		getAttributesXml: function ()
		{
			var me = this,
				attr = '';

			Ext.Object.each(
				me.attributes,
				function (key, val)
				{
					attr += key + '="' + val + '" ';
				}
			);

			return attr;
		}
	}
);