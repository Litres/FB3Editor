/**
 * Контейнер содержащий форму свойств элемента редактора текста.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.desc.editor.Container',
	{
		extend: 'Ext.Container',
		requires: [
			'FBEditor.view.panel.main.props.desc.editor.ContainerController',
			'FBEditor.view.panel.main.props.desc.editor.a.Editor',
			'FBEditor.view.panel.main.props.desc.editor.annotation.Editor'
		],

		id: 'panel-props-desc-editor-container',
		xtype: 'panel-props-desc-editor-container',
		controller: 'panel.props.desc.editor.container',

		listeners: {
			beforeactivate: 'onBeforeActivate',
			afterRender: 'onAfterRender',
			loadData: 'onLoadData'
		},

		hidden: true,

		/**
		 * @property {Ext.panel.Panel} Панель редактирования элемента.
		 */
		editor: null,

		/**
		 * @private
		 * @property {FBEditor.view.panel.main.props.body.Body} Панель свойств.
		 */
		panelProps: null,

		cleanContainer: function ()
		{
			var me = this,
				manager = FBEditor.getEditorManager();

			// сбрасываем фокус
			manager.resetFocus();
		},

		/**
		 * Возвращает панель свойств редактора текста.
		 * @return {FBEditor.view.panel.main.props.body.Body}
		 */
		getPanelProps: function ()
		{
			var me = this,
				panelProps;

			panelProps = me.panelProps || Ext.getCmp('panel-props-desc');
			me.panelProps = panelProps;

			return panelProps
		}
	}
);