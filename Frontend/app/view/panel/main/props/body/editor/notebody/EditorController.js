/**
 * Контроллер панели notebody.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.notebody.EditorController',
	{
		extend: 'FBEditor.view.panel.main.props.body.editor.AbstractEditorController',
		
		alias: 'controller.panel.props.body.editor.notebody',
		
		onChange: function ()
		{
			var me = this,
				view = me.getView(),
				notesCmp;
			
			me.callParent(arguments);
			
			// обновляем кнопки на сноски
			notesCmp = view.getNotesCmp();
			notesCmp.updateView();
		}
	}
);