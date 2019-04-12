/**
 *
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.window.outputsection.item.output.OutputController',
	{
		extend: 'Ext.app.ViewController',
		
		alias: 'controller.window.outputsection.item.output',
		
		onChange: function (cmp, newValue, oldValue)
		{
			var me = this,
				view = me.getView(),
				el = view.sectionEl,
				manager = el.getManager(),
				panelProps;
			
			// обновляем аттрибут элемента
			el.update({output: newValue}, {withoutView: true, merge: true});
			
			// обновляем данные на панели свойств
			panelProps = manager.getPanelProps();
			panelProps.updateEditor();
		}
	}
);