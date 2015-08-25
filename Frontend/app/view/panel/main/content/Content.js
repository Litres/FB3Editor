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
			'FBEditor.view.panel.editor.Editor',
			'FBEditor.view.form.desc.Desc',
			'FBEditor.view.panel.resources.Resources',
			'FBEditor.view.panel.empty.Empty'
		],
		id: 'panel-main-content',
		xtype: 'panel-main-content',
		controller: 'panel.main.content',
		panelName: 'content',
		region: 'center',
		collapsible: false,
		layout: 'card',
		minWidth: 610,
		overflowX: true,
		margin: '0 2px 0 2px',
		bodyPadding: 0,
		//activeItem: 'main-editor',
		items: [
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
				xtype: 'panel-empty'
			}
		],
		listeners: {
			resize: 'onResize',
			contentBody: 'onContentBody',
			contentDesc: 'onContentDesc',
			contentResources: 'onContentResources',
			contentEmpty: 'onContentEmpty'
		},

		afterRender: function ()
		{
			var me = this,
				manager = FBEditor.desc.Manager;

			if (!manager.loadUrl)
			{
				// переключаем контекст на текст
				Ext.defer(
					function ()
					{
						me.openBody();
					},
					500
				);
			}

			me.callParent(arguments);
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