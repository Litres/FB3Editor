/**
 * Вкладка Текст.
 *
 * Синхронизация кнопок вызывается из менеджера редактора FBEditor.view.panel.main.editor.Manager#syncButtons().
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.Main',
	{
		extend: 'Ext.panel.Panel',
		requires: [
			'FBEditor.view.panel.toolstab.main.MainController'
		],

		id:'panel-toolstab-main',
		xtype: 'panel-toolstab-main',
		controller: 'panel.toolstab.main',

		title: 'Текст',

		/**
		 * @private
		 * @property {FBEditor.view.panel.main.editor.Editor} Редактор тела книги.
		 */
		mainEditor: null,

		/**
		 * @private
		 * @property {FBEditor.editor.view.toolbar.Toolbar} Активный тулбар.
		 */
		activeToolbar: null,

		translateText: {
			loading: 'Загрузка xmllint ...'
		},

		afterRender: function ()
		{
			var me = this,
				tt = me.translateText,
				loading,
				mainEditor,
				manager,
				sch;
			
			if (!FBEditor.accessXmllint)
			{
				// добавляем надпись о загрузке xmllint
				
				loading = {
					xtype: 'component',
					padding: 10,
					style: {
						color: 'gray',
						background: '#fff'
					},
					html: tt.loading
				};
				
				me.add(loading);
				
				// редактор тела книги
				mainEditor = me.getMainEditor();
				
				// вызываем тестовую проверку по схеме для определения загрузки xmllint
				manager = mainEditor.getManager();
				sch = manager.getSchema();
				sch.validXml({xml: 'test', callback: me.verifyResult, scope: me});
			}
			
			me.callParent(arguments);
		},

		/**
		 * Добавляет тулбар на вкладку.
		 * @param {FBEditor.editor.view.toolbar.Toolbar} toolbar Тулбар редактора текста.
		 */
		addToolbar: function (toolbar)
		{
			var me = this;

			me.addDocked(toolbar);

			if (toolbar.isDefaultShow())
			{
				// показываем тулбар
				me.setActiveToolbar(toolbar);
			}
		},

		/**
		 * Активен ли тулбар.
		 * @param {FBEditor.editor.view.toolbar.Toolbar} toolbar Тулбар.
		 * @return {Boolean}
		 */
		isActiveToolbar: function (toolbar)
		{
			var me = this,
				activeToolbar = me.getActiveToolbar(),
				active;

			active = activeToolbar && activeToolbar.getId() === toolbar.getId();

			return active;
		},

		/**
		 * Активирует тулбар.
		 * @param {FBEditor.editor.view.toolbar.Toolbar} toolbar Тулбар.
		 */
		setActiveToolbar: function (toolbar)
		{
			var me = this,
				dockedItems = me.getDockedItems();

			Ext.Array.each(
				dockedItems,
			    function (item)
			    {
				    var editor,
					    manager;

				    // деактивируем тулбар
				    item.setVisible(false);

				    // сбрасываем фокус
				    editor = item.getEditor();
				    manager = editor.getManager();
				    manager.resetFocus();
			    }
			);

			me.activeToolbar = toolbar;
			toolbar.setVisible(FBEditor.accessXmllint);
		},

		/**
		 * Возвращает активный тулбар.
		 * @return {FBEditor.editor.view.toolbar.Toolbar}
		 */
		getActiveToolbar: function ()
		{
			return this.activeToolbar;
		},

		/**
		 * Возвращает редактор текста книги.
		 * @return {FBEditor.view.panel.main.editor.Editor}
		 */
		getMainEditor: function ()
		{
			var me = this,
				mainEditor;

			mainEditor = me.mainEditor || Ext.getCmp('main-editor');
			me.mainEditor = mainEditor;

			return mainEditor;
		},

		/**
		 * Получает результат проверки xmllint.
		 * @param {Boolean} res
		 * @param {Object} data
		 * @param {Boolean} data.loaded Загружен ли xmllint.
		 */
		verifyResult: function (res, data)
		{
			var me = this,
				activeToolbar = me.getActiveToolbar(),
				items = me.items,
				first;

			if (data.loaded)
			{
				Ext.log({msg: 'xmllint загружен', level: 'info'});

				// удаляем надпись о загрузке xmllint
				first = items.first();
				me.remove(first);

				FBEditor.accessXmllint = true;

				if (activeToolbar)
				{
					me.setActiveToolbar(activeToolbar);
				}
			}
		}
	}
);