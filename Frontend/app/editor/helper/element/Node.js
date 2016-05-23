/**
 * Хэлпер для работы с отображением элемента.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.helper.element.Node',
	{
		/**
		 * @private
		 * @property {FBEditor.editor.element.AbstractElement} Элемент.
		 */
		el: null,

		constructor: function (el)
		{
			var me = this;

			me.el = el;
		},

		/**
		 * Возвращает узел элемента.
		 * @param {String} [viewportId] Айди окна.
		 * @return {Node}
		 */
		getNode: function (viewportId)
		{
			var me = this,
				el = me.el,
				node;

			node = viewportId ? el.nodes[viewportId] : Ext.Object.getKeys(el.nodes)[0];

			return node;
		}
	}
);