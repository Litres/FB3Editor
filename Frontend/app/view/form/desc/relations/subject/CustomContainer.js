/**
 * Контейнер данных.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.CustomContainer',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.relations.subject.CustomContainerController',
			'FBEditor.view.form.desc.relations.subject.custom.editor.Editor',
			'FBEditor.view.form.desc.relations.subject.custom.viewer.Viewer'
		],

		xtype: 'form-desc-relations-subject-container-custom',
		controller: 'form.desc.relations.subject.container.custom',

		listeners: {
			showCustom: 'onShowCustom',
			showEditor: 'onShowEditor',
			showViewer: 'onShowViewer',
			stateSwitcher: 'onStateSwitcher'
		},

		layout: 'anchor',
		flex: 1,
		defaults: {
			anchor: '100%'
		},

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.relations.subject.custom.viewer.Viewer} Контейнер отображающий краткую
		 * сводку данных.
		 */
		_customViewer: null,

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.relations.subject.custom.editor.Editor} Контейнер содержащий
		 * компоненты ручного ввода.
		 */
		_customEditor: null,

		initComponent: function ()
		{
			var me = this;

			me.hidden = FBEditor.accessHub;

			me.items = [
				{
					xtype: 'form-desc-relations-subject-custom-viewer'
				},
				{
					xtype: 'form-desc-relations-subject-custom-editor'
				}
			];

			me.callParent(arguments);
		},

		/**
		 * Возвращает контейнер отображающий краткую сводку данных.
		 * @return {FBEditor.view.form.desc.relations.subject.custom.viewer.Viewer}
		 */
		getCustomViewer: function ()
		{
			var me = this,
				container = me._customViewer;

			container = container || me.down('form-desc-relations-subject-custom-viewer');
			me._customViewer = container;

			return container;
		},

		/**
		 * Возвращает контйенер содержащий компоненты ручного ввода.
		 * @return {FBEditor.view.form.desc.relations.subject.custom.editor.Editor}
		 */
		getCustomEditor: function ()
		{
			var me = this,
				container = me._customEditor;

			container = container || me.down('form-desc-relations-subject-custom-editor');
			me._customEditor = container;

			return container;
		},

		/**
		 * Возвращает состояние переключателя.
		 * @return {Boolean} Показать ли редактируемые поля.
		 */
		getStateSwitcher: function ()
		{
			var me = this,
				viewer,
				switcher,
				state;
			
			viewer = me.getCustomViewer();
			switcher = viewer.getSwitcher();
			state = switcher.getStateCmp();
			
			return state;
		}
	}
);