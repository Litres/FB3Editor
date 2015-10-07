/**
 * Преамбула.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.preamble.Preamble',
	{
		extend: 'FBEditor.view.form.desc.htmleditor.HtmlEditor',
		xtype: 'form-desc-preamble',
		name: 'preamble',
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
				data.preamble = val;
			}

			return data;
		}
	}
);