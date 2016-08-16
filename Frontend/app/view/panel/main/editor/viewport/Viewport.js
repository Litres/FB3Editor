/**
 * Контейнер в панели редактора текста книги, в котором редактируются элементы.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.viewport.Viewport',
	{
		extend: 'FBEditor.editor.view.viewport.Viewport',
		requires: [
			'FBEditor.view.panel.main.editor.viewport.ViewportController'
		],

		xtype: 'main-editor-viewport',
		controller: 'main.editor.viewport',
		cls: 'editor-viewport main-editor-viewport',

		listeners: {
			syncScroll: 'onSyncScroll'
		},

		/**
		 * @property {Boolean} Создать ли корневой элемент.
		 */
		createRootElement: false,

		createRoot: function ()
		{
			var me = this,
				editor = me.getEditor(),
				manager;

			// надо ли создавать корневой элемент, так как при разделении окна содержимое копируется из оригинала
			if (me.createRootElement)
			{
				me.callParent(arguments);
				manager = editor.getManager();

				if (manager.isLoadUrl())
				{
					// загружаем тело с хаба
					manager.loadFromUrl();
				}

				// обновляем дерево навигации по тексту
				manager.updateTree();
			}
		}
	}
);