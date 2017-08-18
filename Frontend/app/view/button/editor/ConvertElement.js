/**
 * Кнопка превращения блочного элемента текста в стилевой.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.button.editor.ConvertElement',
	{
		extend: 'Ext.button.Button',
		requires: [
			'FBEditor.editor.command.ConvertToTextCommand'
		],

		id: 'button-editor-convert-element',
		xtype: 'button-editor-convert-element',

		text: 'Превратить в текст',

		/**
		 * @property {FBEditor.editor.element.AbstractElement} Ссылка на элемент.
		 */
		element: null,

		handler: function ()
		{
			var me = this,
				bridge = FBEditor.getBridgeWindow(),
				data = {},
				el = me.element,
				history,
				cmd;

			data.el = el;
			cmd = bridge.Ext.create('FBEditor.editor.command.ConvertToTextCommand', data);

			if (cmd.execute())
			{
				history = el.getHistory();
				history.add(cmd);
			}
		},

		/**
		 * Проверяет по схеме возможную новую структуру после преобразования.
		 * @return {Boolean} Разрешено ли преобразование.
		 */
		verify: function ()
		{
			var me = this,
				els = {},
				nodes = {},
				manager = FBEditor.getEditorManager(),
				sch = manager.getSchema(),
				viewportId,
				range,
				res;

			range = manager.getRange();

			if (!range)
			{
				return false;
			}

			viewportId = range.start.viewportId;

			els.node = me.element;
			nodes.node = els.node.nodes[viewportId];
			els.parent = els.node.parent;
			nodes.parent = els.parent.nodes[viewportId];

			els.nameEl = els.parent.getName();
			els.pos = els.parent.getChildPosition(els.node);
			els.namesElements = manager.getNamesElements(els.parent);
			els.namesElements.splice(els.pos, 1, 'p');

			res = sch.verify(els.nameEl, els.namesElements);

			res = !res && !els.node.isEmpty() ? sch.verify(els.node.getName(), ['p']) : res;

			return res;
		}
	}
);