/**
 * Аннотация.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.annotation.Annotation',
	{
		extend: 'FBEditor.view.form.desc.htmleditor.HtmlEditor',
		xtype: 'form-desc-annotation',
		name: 'anotation',
		height: 200,
		resizable: {
			handles: 's',
			minHeight: 100,
			pinned: true
		},

		getValues: function (d)
		{
			var me = this,
				val = me.getValue(),
				data = d;

			if (val)
			{
				data.anotation = val;
			}

			return data;
		}
	}
);