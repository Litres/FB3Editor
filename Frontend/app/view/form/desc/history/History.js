/**
 * История.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.history.History',
	{
		extend: 'FBEditor.view.form.desc.htmleditor.HtmlEditor',
		xtype: 'form-desc-history',
		name: 'history',
		height: 200,

		getValues: function (d)
		{
			var me = this,
				val = me.getValue(),
				data = d;

			if (val)
			{
				data.history = val;
			}

			return data;
		}
	}
);