/**
 * Панель контента.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.content.Content',
	{
		extend: 'FBEditor.view.panel.main.Abstract',
		requires: [
			'FBEditor.view.panel.main.content.ContentController',
			'FBEditor.view.panel.main.editor.Editor',
			'FBEditor.view.form.desc.Desc',
			'FBEditor.view.panel.resources.Resources',
			'FBEditor.view.panel.empty.Empty'
		],

		id: 'panel-main-content',
		xtype: 'panel-main-content',
		controller: 'panel.main.content',

		items: [
			{
				xtype: 'panel-empty'
			},
			{
				xtype: 'form-desc'
			},
			
			{
				xtype: 'panel-resources'
			},
			{
				xtype: 'main-editor'
			}
		],

		listeners: {
			resize: 'onResize',
			contentBody: 'onContentBody',
			contentDesc: 'onContentDesc',
			contentResources: 'onContentResources',
			contentEmpty: 'onContentEmpty'
		},
		
		activeItem: 'form-desc',
		panelName: 'content',
		region: 'center',
		collapsible: false,
		layout: 'card',
		minWidth: 610,
		overflowX: true,
		margin: '0 2px 0 2px',
		bodyPadding: 0,

		/**
		 * @private
		 * @property {FBEditor.view.panel.main.editor.Editor} Редактор текста книги.
		 */
		mainEditor: null,

		/**
		 * @private
		 * @property {FBEditor.view.panel.main.tools.ToolsTab} Вкладки панели инструментов.
		 */
		panelToolstab: null,

		/**
		 * @private
		 * @property {FBEditor.view.panel.toolstab.main.Main} Вкладка Форматирование.
		 */
		toolstab: null,

		afterRender: function ()
		{
			var me = this,
				mainEditor,
				editorManager;

			// панель редактор текста
			mainEditor = me.getMainEditor();

			//  создаем корневой элемент редактора текста книги
			mainEditor.createRootElement();

			editorManager = mainEditor.getManager();

			if (editorManager.isLoadUrl())
			{
				// показываем редактор тела книги
				me.fireEvent('contentBody');
			}

			me.callParent(arguments);
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
		 * Возвращает панель вкладок.
		 * @return {FBEditor.view.panel.main.tools.ToolsTab}
		 */
		getPanelMainToolstab: function ()
		{
			var me = this,
				panelToolstab;

			panelToolstab = me.panelToolstab || Ext.getCmp('panel-main-toolstab');
			me.panelToolstab = panelToolstab;

			return panelToolstab;
		},

		/**
		 * Возвращает вкладку Форматирование.
		 * @return {FBEditor.view.panel.toolstab.main.Main}
		 */
		getToolstab: function ()
		{
			var me = this,
				toolstab;

			toolstab = me.toolstab || Ext.getCmp('panel-toolstab-main');
			me.toolstab = toolstab;

			return toolstab;
		},

		/**
		 * Активана ли панель.
		 * @param {String} itemId Id панели.
		 * @return {Boolean}
		 */
		isActiveItem: function (itemId)
		{
			var me = this,
				res,
				layout,
				active;

			layout = me.getLayout();
			active = layout.getActiveItem();
			res = active.getId() === itemId;

			return res;
		},

		/**
		 * Открывает панель текста.
		 */
		openBody: function ()
		{
			var me = this,
				nav;

			if (!Ext.getCmp('main-editor') || !Ext.getCmp('main-editor').rendered)
			{
				Ext.defer(
					function ()
					{
						me.openBody();
					},
					500
				);
			}

			Ext.create('FBEditor.command.OpenBody').execute();
			nav = Ext.getCmp('panel-body-navigation');
			//console.log('root nav', nav.getRootNode());
			nav.selectRoot();
		}
    }
);