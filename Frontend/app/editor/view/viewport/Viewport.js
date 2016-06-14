/**
 * Контейнер, в котором редактируются элементы.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.view.viewport.Viewport',
	{
		extend: 'Ext.container.Container',
		requires: [
			'FBEditor.editor.view.viewport.ViewportController'
		],

		xtype: 'editor-viewport',
		controller: 'editor.viewport',
		cls: 'editor-viewport',

		layout: 'fit',

		/**
		 * @private
		 * @property {FBEditor.editor.view.Editor} Редактор текста.
		 */
		editor: null,

		/**
		 * @private
		 * @property {FBEditor.view.panel.toolstab.tools.button.paragraph.Paragraph} Кнопка включения отображения
		 * символа конца абзаца.
		 */
		paragraphBtn: null,

		afterRender: function ()
		{
			var me = this,
				btn;

			me.callParent(me);
			me.createRoot();

			btn = me.getParagraphBtn();

			if (btn.isPressed())
			{
				// добавляем класс для отображения символа конца абзаца
				me.addCls(btn.modeCls);
			}
		},

		/**
		 * Создает корневой элемент.
		 */
		createRoot: function ()
		{
			var me = this,
				editor = me.getEditor(),
				manager,
				root,
				rootNode;

			manager = editor.getManager();
			root = manager.getContent();

			if (!root)
			{
				// создаем корневой элемент
				editor.createRootElement();
			}

			// получаем узел корневого элемента
			rootNode = manager.getNode(me.id);

			// загружаем узел в окно
			me.loadData(rootNode);
		},

		/**
		 * Загружает корневой узел в окно редактора.
		 * @param {Node} node Узел корневого элемента.
		 */
		loadData: function (node)
		{
			var me = this,
				dom,
				content;

			// ссылка на контент в окне редактора
			dom = me.getEl().dom;
			content = me.getContent();

			if (content)
			{
				// заменяем старое содержимое на новое
				dom.replaceChild(node, content);
			}
			else
			{
				// вставляем новое содержимое
				dom.appendChild(node);
			}
		},

		/**
		 * Возвращает контент редактора.
		 * @return {Node}
		 */
		getContent: function ()
		{
			return this.getEl().dom.firstChild;
		},

		/**
		 * Возвращает редактор текста.
		 * @return {FBEditor.editor.view.Editor}
		 */
		getEditor: function ()
		{
			var me = this,
				editor;

			editor = me.editor || me.up('base-editor');
			me.editor = editor;

			return editor;
		},

		/**
		 * Возвращает кнопку включения отображения символа конца абзаца.
		 * @return {FBEditor.view.panel.toolstab.tools.button.paragraph.Paragraph}
		 */
		getParagraphBtn: function ()
		{
			var me = this,
				btn;

			btn = me.paragraphBtn || Ext.getCmp('panel-toolstab-tools-button-paragraph');
			me.paragraphBtn = btn;

			return btn;
		}
	}
);