/**
 * Шаблон XSL для замены подстроки в тексте.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.xsl.template.ReplaceSubstring',
	{
		singleton: true,

		/**
		 * Возвращает шаблон xsl.
		 * @return {String} Шаблон xsl.
		 */
		getTpl: function ()
		{
			var tpl;

			tpl = '\
<xsl:template name="replace-substring">\
	<xsl:param name="original"/>\
	<xsl:param name="substring"/>\
	<xsl:param name="replacement"/>\
	<xsl:choose>\
		<xsl:when test="contains($original, $substring)">\
			<xsl:value-of select="substring-before($original, $substring)"/>\
			<xsl:value-of select="$replacement"/>\
			<xsl:call-template name="replace-substring">\
				<xsl:with-param name="original" select="substring-after($original, $substring)"/>\
				<xsl:with-param name="substring" select="$substring"/>\
				<xsl:with-param name="replacement" select="$replacement"/>\
			</xsl:call-template>\
		</xsl:when>\
		<xsl:otherwise><xsl:value-of select="$original"/></xsl:otherwise>\
	</xsl:choose>\
</xsl:template>\
			';

			return tpl;
		}
	}
);