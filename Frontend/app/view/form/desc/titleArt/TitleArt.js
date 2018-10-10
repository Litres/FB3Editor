/**
 * Название произведения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.titleArt.TitleArt',
	{
		extend: 'FBEditor.view.form.desc.title.Title',
		requires: [
			'FBEditor.view.form.desc.titleArt.TitleArtController'
		],

		controller: 'form.desc.titleArt',
		xtype: 'form-desc-titleArt',
		id: 'form-desc-title',

		cls: 'container-valid',

		listeners: {
			changeTitle: 'onChangeTitle',
			blurTitle: 'onBlurTitle',
			focusTitle: 'onFocusTitle'
		},

		enableSub: true,
		enableAlt: true,
		mainConfig: {
			plugins: [
				{
					ptype: 'fieldCleaner'
				}
			]
		},
		altConfig: {
			plugins: {
				btnStyle: {
					margin: '4px 0 0 5px'
				}
			}
		}
	}
);