/**
 * Изображение маркера.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.div.marker.img.Img',
	{
		extend: 'FBEditor.view.panel.main.props.body.editor.img.Editor',
		requires: [
			'FBEditor.view.panel.main.props.body.editor.div.marker.img.ImgController'
		],

		xtype: 'panel-props-body-editor-marker-img',
		controller: 'panel.props.body.editor.marker.img',

		defaults: {
			xtype: 'textfield',
			labelAlign: 'top',
			checkChangeBuffer: 200,
			listeners: {
				change: function ()
				{
					this.up('panel-props-body-editor-div').fireEvent('change');
				}
			}
		},

		prefixName: 'marker-',

		updateData: function (data, isLoad)
		{
			var me = this,
				prefix = me.prefixName,
				prefixData = {},
				picture;

			//console.log('updateData', data, isLoad);

			data.src = data.src ? data.src : data.name;
			data.url = data.url ? data.url : data.src;
			data.name = data.name ? data.name : me.translateText.emptyImg;

			// проставляем префиксы
			Ext.Object.each(
				data,
				function (key, val)
				{
					prefixData[prefix + key] = val;
				}
			);

			me.getForm().setValues(prefixData);

			if (picture = me.getPicture())
			{
				picture.updateView({url: data.url});
			}
		}
	}
);