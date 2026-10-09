package br.com.projetobarbearia.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.session.ChangeSessionIdAuthenticationStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.security.web.context.DelegatingSecurityContextRepository;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.RequestAttributeSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.context.SecurityContextHolderFilter;

import org.springframework.http.HttpStatus;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;

import java.util.List;

import org.springframework.security.web.authentication.session.CompositeSessionAuthenticationStrategy;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfAuthenticationStrategy;
import org.springframework.security.web.csrf.CsrfTokenRepository;

import jakarta.servlet.DispatcherType;

import org.springframework.http.HttpMethod;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

import br.com.projetobarbearia.repository.UsuarioRepository;
import br.com.projetobarbearia.security.SessaoUsuarioAtivoFilter;

@Configuration
public class SecurityConfig {

        @Bean
        public SecurityFilterChain securityFilterChain(
                        HttpSecurity http,
                        SecurityContextRepository securityContextRepository,
                        CsrfTokenRepository csrfTokenRepository,
                        SessaoUsuarioAtivoFilter sessaoUsuarioAtivoFilter)
                        throws Exception {

                http
                                .csrf(csrf -> csrf
                                                .spa()
                                                .csrfTokenRepository(csrfTokenRepository))
                                .securityContext(securityContext -> securityContext
                                                .securityContextRepository(securityContextRepository))
                                .addFilterAfter(
                                                sessaoUsuarioAtivoFilter,
                                                SecurityContextHolderFilter.class)
                                .authorizeHttpRequests(authorize -> authorize
                                                .dispatcherTypeMatchers(
                                                                DispatcherType.ERROR,
                                                                DispatcherType.FORWARD)
                                                .permitAll()
                                                .requestMatchers(
                                                                HttpMethod.POST,
                                                                "/api/auth/login",
                                                                "/api/usuarios")
                                                .permitAll()
                                                .requestMatchers(
                                                                HttpMethod.GET,
                                                                "/api/auth/csrf")
                                                .permitAll()
                                                .requestMatchers(
                                                                HttpMethod.GET,
                                                                "/api/barbearias/**",
                                                                "/api/enderecos/**",
                                                                "/api/horarios-funcionamento/**",
                                                                "/api/servicos/**",
                                                                "/api/barbeiros/**")
                                                .permitAll()
                                                .anyRequest().authenticated())
                                .exceptionHandling(exception -> exception
                                                .authenticationEntryPoint(
                                                                new HttpStatusEntryPoint(
                                                                                HttpStatus.UNAUTHORIZED)))
                                .formLogin(form -> form.disable())
                                .httpBasic(basic -> basic.disable())
                                .logout(logout -> logout
                                                .logoutUrl("/api/auth/logout")
                                                .logoutSuccessHandler(
                                                                new HttpStatusReturningLogoutSuccessHandler(
                                                                                HttpStatus.NO_CONTENT))
                                                .permitAll());

                return http.build();
        }

        @Bean
        public SessaoUsuarioAtivoFilter sessaoUsuarioAtivoFilter(
                        UsuarioRepository usuarioRepository) {

                return new SessaoUsuarioAtivoFilter(
                                usuarioRepository);
        }

        @Bean
        public CsrfTokenRepository csrfTokenRepository() {

                return CookieCsrfTokenRepository
                                .withHttpOnlyFalse();
        }

        @Bean
        public AuthenticationManager authenticationManager(
                        UserDetailsService userDetailsService,
                        PasswordEncoder passwordEncoder) {

                DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider(userDetailsService);

                authenticationProvider.setPasswordEncoder(passwordEncoder);

                return new ProviderManager(authenticationProvider);
        }

        @Bean
        public SecurityContextRepository securityContextRepository() {

                return new DelegatingSecurityContextRepository(
                                new RequestAttributeSecurityContextRepository(),
                                new HttpSessionSecurityContextRepository());
        }

        @Bean
        public SessionAuthenticationStrategy sessionAuthenticationStrategy(
                        CsrfTokenRepository csrfTokenRepository) {

                CsrfAuthenticationStrategy csrfStrategy = new CsrfAuthenticationStrategy(
                                csrfTokenRepository);

                return new CompositeSessionAuthenticationStrategy(
                                List.of(
                                                new ChangeSessionIdAuthenticationStrategy(),
                                                csrfStrategy));
        }
}
