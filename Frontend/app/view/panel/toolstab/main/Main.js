/**
 * Вкладка Форматирование.
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
			'FBEditor.view.panel.toolstab.main.MainController',
		    'FBEditor.view.panel.toolstab.main.toolbar.Toolbar'
		],

		id:'panel-toolstab-main',
		xtype: 'panel-toolstab-main',
		controller: 'panel.toolstab.main',

		title: 'Форматирование',

		/**
		 * @private
		 * @property {FBEditor.view.panel.main.editor.Editor} Редактор текста книги.
		 */
		mainEditor: null,

		translateText: {
			loading: 'Загрузка xmllint ...'
		},

		initComponent: function ()
		{
			var me = this;

			// надпись по умолчанию, до тех пор, пока не появятся кнопки
			me.items = [
				{
					xtype: 'component',
					padding: 10,
					style: {
						color: 'gray'
					},
					html: me.translateText.loading
				}
			];

			me.callParent(arguments);
		},

		afterRender: function ()
		{
			var me = this,
				mainEditor,
				toolbar,
				manager,
				sch;

			me.callParent(arguments);

			// редактор текста книги
			mainEditor = me.getMainEditor();

			// тулбар
			toolbar = Ext.widget('panel-toolstab-main-toolbar', {dock: 'top', hidden: true});
			me.toolbar = toolbar;
			me.addDocked(toolbar);

			// связываем тулбар с панелью редактора
			mainEditor.setToolbar(toolbar);

			// вызываем тестовую проверку по схеме для определения загрузки xmllint
			manager = mainEditor.getManager();
			sch = manager.getSchema();
			sch.validXml({xml: 'test', callback: me.verifyResult, scope: me});
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
			var me = this;

			if (data.loaded)
			{
				Ext.log({msg: 'xmllint загружен', level: 'info'});

				me.getDockedItems()[0].setVisible(true);
			}
		}
	}
);