/**
 * Кнотроллер корневого элемента.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.root.RootElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',
		requires: [
			'FBEditor.editor.command.TextModifiedCommand'
		],

		/**
		 * Редактирование текстового узла.
		 * @param {Object} e Событие.
		 * @param {Node} e.target Редактируемый узел.
		 */
		onTextModified: function (e)
		{
			var me = this,
				target = e.target,
				parentNode,
				manager,
				cmd;

			manager = me.getElement().getManager();

			if (manager.isSuspendEvent())
			{
				return;
			}

			parentNode = target.parentNode;

			if (!parentNode.getElement)
			{
				Ext.defer(
					function ()
					{
						this.onTextModified({target: target});
					},
					1,
					me
				);

				return;
			}

			//console.log('DOMCharacterDataModified:', e, me);

			cmd = Ext.create('FBEditor.editor.command.TextModifiedCommand',
				{node: target, newValue: e.newValue, oldValue: e.prevValue});

			if (cmd.execute())
			{
				me.getHistory().add(cmd);
			}
		}
	}
);