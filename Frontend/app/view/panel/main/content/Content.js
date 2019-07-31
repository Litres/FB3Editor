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
            'FBEditor.view.form.desc.Desc',
			'FBEditor.view.panel.main.content.ContentController',
			'FBEditor.view.panel.main.editor.Editor',
            'FBEditor.view.panel.main.xml.Xml',
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
			},
            {
                xtype: 'main-xml'
            }
		],

		listeners: {
			resize: 'onResize',
			contentBody: 'onContentBody',
            contentXml: 'onContentXml',
			contentDesc: 'onContentDesc',
			contentResources: 'onContentResources',
			contentEmpty: 'onContentEmpty'
		},
		
		activeItem: 'form-desc',
		panelName: 'content',
		region: 'center',
		collapsible: false,
		layout: 'card',
		//minWidth: 610,
		minWidth: 320,
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
		
		initComponent: function ()
		{
			var me = this,
				routeManager = FBEditor.route.Manager;
			
			if (routeManager.isSetParam('only_text'))
			{
				me.activeItem = 'main-editor';
			}
			
			me.callParent(arguments);
		},

		afterRender: function ()
		{
			var me = this,
				mainEditor,
				editorManager,
				cmd;

			// панель редактор текста
			mainEditor = me.getMainEditor();

			//  создаем корневой элемент редактора текста книги
			mainEditor.createRootElement();

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
		 * Возвращает панель управления вложенностью секций.
         * @return {FBEditor.view.panel.main.navigation.section.Panel}
         */
		getSectionPanel: function ()
		{
            var bridge = FBEditor.getBridgeNavigation(),
                panel;

            panel = bridge.Ext.getCmp('panel-navigation-section');

            return panel;
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
				mainEditor = me.getMainEditor(),
				nav;

			if (!mainEditor || !mainEditor.rendered)
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
			nav.selectRoot();
		}
    }
);