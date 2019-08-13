/**
 * Панель редактирования элемента notebody.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.notebody.Editor',
	{
		extend: 'FBEditor.view.panel.main.props.body.editor.AbstractEditor',
		requires: [
			'FBEditor.view.panel.main.props.body.editor.notebody.EditorController',
			'FBEditor.view.panel.main.props.body.editor.notebody.notes.Notes'
		],
		
		controller: 'panel.props.body.editor.notebody',

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'panel-props-body-editor-fields-id'
				},
				{
					xtype: 'panel-props-body-editor-notebody-notes'
				}
			];

			me.callParent(arguments);
		},
		
		/**
		 * Возвращает кнопки для перехода к сноскам.
		 * @return {FBEditor.view.panel.main.props.body.editor.notebody.notes.Notes}
		 */
		getNotesCmp: function ()
		{
			return this.down('panel-props-body-editor-notebody-notes');
		}
	}
);