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
		 * @property {String} Имя тега для отображения в html.
		 */
		nameTag: 'div',

		/**
		 * @property {String} Строка стилей.
		 */
		style: '',

		/**
		 * @param {FBEditor.editor.element.AbstractElement[]|null} [children] Дочерние элементы.
		 */
		constructor: function (children)
		{
			var me = this;

			me.children = children || me.children;
		},

		getHtml: function ()
		{
			var me = this,
				children = me.children,
				nt = me.nameTag,
				html,
				attr;

			attr = me.getAttributes();
			html = '<' + nt;
			html += attr ? ' ' + attr : '';
			if (children)
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

		/**
		 * @private
		 * Возвращает строку атрибутов элементов для отображения в html.
		 * @return {String} Строка атрибутов.
		 */
		getAttributes: function ()
		{
			var me = this,
				attr;

			attr = me.style ? 'style="' + me.style + '"' : '';

			return attr;
		}
	}
);