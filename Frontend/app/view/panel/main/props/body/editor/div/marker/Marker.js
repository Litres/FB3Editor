/**
 * Маркер.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.div.marker.Marker',
	{
		extend: 'Ext.form.FieldSet',
		requires: [
			'FBEditor.view.panel.main.props.body.editor.div.marker.img.Img'
		],
		
		xtype: 'panel-props-body-editor-marker',

		listeners: {
			collapse: function ()
			{
				this.setMarker(false);

				// сбрасываем форму маркера
				this.reset();
			},
			expand: function ()
			{
				this.setMarker(true);
			}
		},

		collapsible: true,
		collapsed: true,
		border: true,
		padding: 10,
		margin: '10 0 0 0',

		/**
		 * @private
		 * @property {FBEditor.view.panel.main.props.body.editor.div.marker.img.Img} Изображение маркера.
		 */
		img: null,

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'panel-props-body-editor-marker-img'
				},
				{
					xtype: 'hidden',
					name: 'marker',
					value: false,
					submitValue: true
				}
			];

			me.callParent(arguments);
		},

		updateData: function (data, isLoad)
		{
			var me = this,
				img = me.getImg(),
				marker,
				imgData;

			marker = data.el.marker;
			
			if (marker)
			{
				me.expand();

				// обновляем данные изображения
				imgData = marker.img.getData();
				img.updateData(imgData, isLoad);
			}
			else
			{
				me.collapse();
			}
		},

		/**
		 * Возвразает изображение маркера.
		 * @return {FBEditor.view.panel.main.props.body.editor.div.marker.img.Img}
		 */
		getImg: function ()
		{
			var me = this,
				img;
			
			img = me.img || me.down('panel-props-body-editor-marker-img');
			me.img = img;
			
			return img;
		},

		/**
		 * Устанавливает поле необходимости маркера.
		 * @param {Boolean} data
		 */
		setMarker: function (data)
		{
			var me = this;

			me.down('[name=marker]').setRawValue(data);
			me.up('form').fireEvent('change');
		},

		/**
		 * Сбрасывает данные формы маркера.
		 */
		reset: function ()
		{
			var me = this,
				img = me.getImg();

			img.reset();
		}
	}
);