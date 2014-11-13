/**
 * Аннотация.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.annotation.Annotation',
	{
		extend: 'Ext.form.field.HtmlEditor',
		xtype: 'form-desc-annotation',
		name: 'annotation',
		fieldLabel: 'Аннотация',
		labelAlign: 'top',
		enableColors: false,
		enableAlignments: false,
		enableFont: false,
		enableFontSize: false,
		enableLists: false,

		afterRender: function()
		{
			var me = this,
				toolbar = me.toolbar;

			// удаляем кнопку underline
			toolbar.items.removeAt(2);

			me.callParent(arguments);
		}
	}
);