/**
 * Кнотроллер элемента section.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.section.SectionElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',
		requires: [
			'FBEditor.editor.command.section.CreateCommand'
		],

		/**
		 * Вставляет новую секцию.
		 * @param {Node} node Узел, после которого необходимо вставить секцию.
		 */
		onInsertElement: function (node)
		{
			var cmd;

			cmd = Ext.create('FBEditor.editor.command.section.CreateCommand', {node: node});
			if (cmd.execute())
			{
				FBEditor.editor.HistoryManager.add(cmd);
			}
		}
	}
);