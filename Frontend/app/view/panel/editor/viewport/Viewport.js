/**
 * Окно редактирования текста.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.editor.viewport.Viewport',
	{
		extend: 'Ext.container.Container',
		requires: [
			'FBEditor.view.panel.editor.viewport.ViewportController'
		],
		xtype: 'panel-editor-viewport',
		controller: 'panel.editor.viewport',
		layout: 'fit',
		cls: 'panel-editor-viewport',
		listeners: {
			change: 'onChange',
			syncScroll: 'onSyncScroll'
		},

		/**
		 * @property {Boolean} Создать ли корневой элемент.
		 */
		createRootElement: false,

		afterRender: function ()
		{
			var me = this,
				root,
				rootNode;

			me.callParent(this);
			if (me.createRootElement)
			{
				// инициализируем корневой узел
				root = FBEditor.editor.Manager.createRootElement();
				rootNode = root.getNode(me.id);
				me.loadData(rootNode);

				// создаем элементы корневого узла по умолчанию
				root.createScaffold();

				FBEditor.editor.Manager.suspendEvent = true;

				// добавляем узлы в корневой
				Ext.Array.each(
					root.children,
					function (item)
					{
						rootNode.appendChild(item.getNode(me.id));
					}
				);

				FBEditor.editor.Manager.suspendEvent = false;

				// обновляем дерево навигации по тексту
				FBEditor.editor.Manager.updateTree();
			}
		},

		/**
		 * Загружает данные тела книги в окно редактора.
		 * @param {HTMLElement} data Тело книги.
		 */
		loadData: function (data)
		{
			var me = this,
				dom,
				content;

			dom = me.getEl().dom;
			content = me.getContent();
			if (content)
			{
				dom.replaceChild(data, content);
			}
			else
			{
				dom.appendChild(data);
			}
		},

		/**
		 * Возвращает корневой элемент контента.
		 * @return {FBEditor.editor.element.AbstractElement}
		 */
		getContent: function ()
		{
			return this.getEl().dom.firstChild;
		}
	}
);