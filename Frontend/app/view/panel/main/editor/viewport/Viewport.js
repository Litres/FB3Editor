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
		cls: 'main-editor-viewport',

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
				manager = FBEditor.editor.Manager,
				root,
				rootNode;

			// надо ли создавать корневой элемент
			if (me.createRootElement)
			{
				// инициализируем корневой узел
				root = manager.createRootElement();
				rootNode = root.getNode(me.id);
				me.loadData(rootNode);

				// создаем элементы корневого узла по умолчанию
				root.createScaffold();

				manager.suspendEvent = true;

				// добавляем узлы в корневой
				Ext.Array.each(
					root.children,
					function (item)
					{
						rootNode.appendChild(item.getNode(me.id));
					}
				);

				manager.suspendEvent = false;

				// обновляем дерево навигации по тексту
				manager.updateTree();
			}
		}
	}
);