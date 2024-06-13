module.exports = plugin => {
    const sanitizeOutput = (user) => {
      const {
        password, resetPasswordToken, confirmationToken, ...sanitizedUser
      } = user; // be careful, you need to omit other private attributes yourself
      return sanitizedUser;
    };
    plugin.controllers.user.me = async (ctx) => {
      if (!ctx.state.user) {
        return ctx.unauthorized();
      }
      const user = await strapi.entityService.findOne(
        'plugin::users-permissions.user',
        ctx.state.user.id,
        { populate: ['role','organizacion','profilePicture','country','city','ejeTematico','ejeTematico.localizations','areaConocimiento','gender','gender.localizations','HabilidadesUsuario','HabilidadesUsuario.habilidad','HabilidadesUsuario.habilidad.localizations','HabilidadesUsuario.calificacion','skills','RedColaborarRol','RedColaborarRol.Acciones','RedColaborarRol.Acciones.Seccion','HabilidadesUsuario.calificacion.localizations','skills','skills.localizations','skills','skills.localizations'] }
      );
      ctx.body = sanitizeOutput(user);
    };
    plugin.controllers.user.find = async (ctx) => {
      const users = await strapi.entityService.findMany(
        'plugin::users-permissions.user',
        { ...ctx.params, populate: ['role','organizacion','profilePicture','country','city','ejeTematico','ejeTematico.localizations','areaConocimiento','gender','gender.localizations','HabilidadesUsuario','HabilidadesUsuario.habilidad','HabilidadesUsuario.habilidad.localizations','HabilidadesUsuario.calificacion','skills','RedColaborarRol','RedColaborarRol.Acciones','RedColaborarRol.Acciones.Seccion','HabilidadesUsuario.calificacion.localizations','skills','skills.localizations'] }
      );
      ctx.body = users.map(user => sanitizeOutput(user));
    };
    return plugin;
  };
