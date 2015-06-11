/**
 * Абстрактная команда редактора тела книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.AbstractCommand',
	{
		extend: 'FBEditor.command.InterfaceCommand',

		/**
		 * @property {Object} Данные для команды.
		 */
		data: null,

		/**
		 * @param {Object} opts Данные.
		 */
		constructor: function (opts)
		{
			var me = this;

			me.data = opts;
		},

		/**
		 * Возвращает данные для команды.
		 * @return {Object} Данные для команды.
		 */
		getData: function ()
		{
			return this.data;
		},

		/**
		 * В первом ли узле находится начальное выделение.
		 * @param {Node} common Самый верхний узел относительно которого происходит разделение дочернего узла.
		 * @param {Node} start Начальный узел выделения.
		 * @returns {Boolean} Первый ли узел.
		 */
		isFirstContainer: function (common, start)
		{
			var nodes = {},
				els = {};

			els.common = common.getElement();
			nodes.node = start;
			els.node = nodes.node.getElement();
			nodes.parent = nodes.node.parentNode;
			els.parent = nodes.parent.getElement();
			nodes.parentParent = nodes.parent.parentNode;
			els.parentParent = nodes.parentParent.getElement();
			//console.log('common', common);
			while (els.parentParent.elementId !== els.common.elementId && els.parent.elementId !== els.common.elementId)
			{
				nodes.first = nodes.parent.firstChild;
				els.first = nodes.first.getElement();
				//console.log('first, parent, parentParent', nodes.first, nodes.parent, nodes.parentParent, [els.first.elementId, els.node.elementId]);
				if (els.first.elementId !== els.node.elementId)
				{
					return true;
				}
				nodes.node = nodes.parent;
				els.node = nodes.node.getElement();
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();
				nodes.parentParent = nodes.parent.parentNode;
				els.parentParent = nodes.parentParent.getElement();
			}

			return false;
		}
	}
);